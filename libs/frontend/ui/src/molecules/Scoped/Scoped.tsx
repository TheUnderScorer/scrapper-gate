import React, {
  ComponentType,
  ReactNode,
  useMemo,
  useRef,
  useState,
} from 'react';
import root from 'react-shadow';
import { jssPreset, StylesProvider } from '@material-ui/styles';
import { create } from 'jss';
import { useContainerStore } from '@scrapper-gate/frontend/common';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

export interface ScopedProps {
  children: (shadowRoot: ShadowRoot, container: HTMLDivElement) => ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RootDiv = root.div as ComponentType<any>;

export const Scoped = ({ children }: ScopedProps) => {
  const setContainer = useContainerStore((store) => store.setContainer);
  const setShadowRoot = useContainerStore((store) => store.setShadowRoot);
  const topDivRef = useRef<HTMLDivElement>();
  const containerRef = useRef<HTMLDivElement>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [jss, setJss] = useState<any>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  const setRefAndCreateJss = (headRef: HTMLElement | null) => {
    if (headRef && !jss) {
      const createdJssWithRef = create({
        ...jssPreset(),
        insertionPoint: headRef,
      });
      setJss(createdJssWithRef);
      setTarget(headRef);
    }
  };

  const emotionCache = useMemo(
    () =>
      createCache({
        key: 'scrapper-gate-styles',
        container: target,
      }),
    [target]
  );

  return (
    <RootDiv ref={containerRef}>
      <div ref={setRefAndCreateJss} />
      {target && containerRef.current && jss && emotionCache && (
        <CacheProvider value={emotionCache}>
          <StylesProvider jss={jss}>
            <div>
              <div
                className="scoped-root"
                ref={(element) => {
                  setContainer(element ?? undefined);
                  setShadowRoot(element.getRootNode() as ShadowRoot);

                  topDivRef.current = element;
                }}
              >
                {children(containerRef.current.shadowRoot, topDivRef.current)}
              </div>
            </div>
          </StylesProvider>
        </CacheProvider>
      )}
    </RootDiv>
  );
};
