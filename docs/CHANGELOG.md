# [1.0.0-test.19](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.0.0-test.18...v1.0.0-test.19) (2021-12-03)


### Bug Fixes

* **variables:** Remove sticky header from suggestions ([261f2e3](https://github.com/TheUnderScorer/scrapper-gate/commit/261f2e387081d443a8f9b349940139b383e8bd00))


### Features

* **conditional-rules:** Improve ui ([c19a098](https://github.com/TheUnderScorer/scrapper-gate/commit/c19a098d19b0b0de9660a841791ecb89509b5d50))
* **scrapper-builder:** Replace open step url button with icon ([8b01131](https://github.com/TheUnderScorer/scrapper-gate/commit/8b011318857e6f27098bfe7a0f568a87f92f06f4))
* **ui:** Make selectable paper accessible by keyboard ([bebe07b](https://github.com/TheUnderScorer/scrapper-gate/commit/bebe07b6a822078873421b276943fa4cfaa48546))


### Reverts

* Revert "ci: Test usage of pulumi local" ([09aef35](https://github.com/TheUnderScorer/scrapper-gate/commit/09aef35f4d7fd557d2f43ea3b0f881a5b072530f))
* Revert "ci: Restore old pulumi setup for e2e" ([6f06a56](https://github.com/TheUnderScorer/scrapper-gate/commit/6f06a56da1797fc896e416c6d636ed1e0b0193c9))
* Revert "ci: Remove pulumi token" ([5ed1635](https://github.com/TheUnderScorer/scrapper-gate/commit/5ed1635a8d874d555d74f5df2f55535201125756))

# [1.0.0-test.18](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.0.0-test.17...v1.0.0-test.18) (2021-11-05)


### Bug Fixes

* **scrapper-builder:** Fix conditional rules not being saved ([28fbc6a](https://github.com/TheUnderScorer/scrapper-gate/commit/28fbc6a48807d8e73f73f5ad0756dc7c26696cbb))


### Features

* Add "wait" step ([6481e08](https://github.com/TheUnderScorer/scrapper-gate/commit/6481e088ef1607a65f6ce21287dce52fe4ed8548))

# [1.0.0-test.17](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.0.0-test.16...v1.0.0-test.17) (2021-11-02)


### Bug Fixes

* **scrapper-builder:** Delete connected steps ([1f4aa6b](https://github.com/TheUnderScorer/scrapper-gate/commit/1f4aa6b5ec467071770de2d9ae68b79c4f342b51))
* **scrapper-builder:** Don't show duplicated variables ([77c5530](https://github.com/TheUnderScorer/scrapper-gate/commit/77c5530a21ef8da25f90cc3886bc4991eb6b1536))

# [1.0.0-test.16](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.0.0-test.15...v1.0.0-test.16) (2021-10-31)


### Bug Fixes

* **block-editor:** Reset slate selection on external change ([b70f4cb](https://github.com/TheUnderScorer/scrapper-gate/commit/b70f4cb1e668addc8260d5ae64bb4537fc3e2609))
* **scrapper:** Include performance info in failed steps ([b2d41e6](https://github.com/TheUnderScorer/scrapper-gate/commit/b2d41e6d8a05c1d402937644ae366d7fdfc2e241))


### Features

* **scrapper-builder:** Hide fields when not needed ([773ca4e](https://github.com/TheUnderScorer/scrapper-gate/commit/773ca4e62dd36ee2e350fd3279a1922191162c38))
* **scrapper-builder:** Validate if previous step url can be used ([93606b5](https://github.com/TheUnderScorer/scrapper-gate/commit/93606b5559c7d29650af3b28720fdfa2bd037cf0))
* **scrapper:** Create variables from finished steps ([8a26f5c](https://github.com/TheUnderScorer/scrapper-gate/commit/8a26f5cc62f753ec152a180f87a4838a45346db1))

# [1.0.0-test.15](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.0.0-test.14...v1.0.0-test.15) (2021-10-30)


### Features

* **scrapper:** Add value type to read text and read attribute step ([a85d2d8](https://github.com/TheUnderScorer/scrapper-gate/commit/a85d2d80b92130427f08185b100b89d5733e32f5))

# [1.0.0-test.14](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.0.0-test.13...v1.0.0-test.14) (2021-10-28)


### Features

* **scrapper-run-result:** Show step errors ([8922fcc](https://github.com/TheUnderScorer/scrapper-gate/commit/8922fccab50ea5ca5766c886e073a7fef249504b))


### Reverts

* Revert "test: Don't use url navigation to content script" ([626311a](https://github.com/TheUnderScorer/scrapper-gate/commit/626311a8b18204eb6844d1b4beeb25d729854a1d))
* Revert "ci: Temp keep only e2e tests" ([219bf60](https://github.com/TheUnderScorer/scrapper-gate/commit/219bf60ba86699c3771143889428f926e81d3ccc))

# [1.0.0-test.13](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.0.0-test.12...v1.0.0-test.13) (2021-10-19)


### Features

* **scrapper:** Add "Read attribute" action ([f8fe84f](https://github.com/TheUnderScorer/scrapper-gate/commit/f8fe84f9fe517a806b74a5643bed4abf59206e5d))

# [1.0.0-test.12](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.0.0-test.11...v1.0.0-test.12) (2021-10-15)


### Features

* **flow-builder:** Change "delete node" action color to error ([79bdd37](https://github.com/TheUnderScorer/scrapper-gate/commit/79bdd3796c396fa28dd39c7ddbb9733b28bf1d8d))
* **scrapper-runner:** Support setting run settings for individual run ([f524806](https://github.com/TheUnderScorer/scrapper-gate/commit/f5248068690bd332d777f02067e11b1cc650dcf7))
* **scrapper:** Add "Change run settings" step ([b03b75b](https://github.com/TheUnderScorer/scrapper-gate/commit/b03b75b16d820c8e42ccbafec2c75c04ef44f9e3))

# [1.0.0-test.11](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.0.0-test.10...v1.0.0-test.11) (2021-10-12)


### Bug Fixes

* **scrapper-runner:** Use selectors from conditional rules as well ([34fa00d](https://github.com/TheUnderScorer/scrapper-gate/commit/34fa00d86b0313d3306624e4e78412ec719a3b4d))

# [1.0.0-test.10](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.0.0-test.9...v1.0.0-test.10) (2021-10-12)


### Bug Fixes

* **flow-builder:** Fix flickering after toggling tabs ([335363d](https://github.com/TheUnderScorer/scrapper-gate/commit/335363d6cd420de5c25d9c57d35df57f834aa48b))


### Features

* Add better run state indicators ([f2e5eec](https://github.com/TheUnderScorer/scrapper-gate/commit/f2e5eecdca21116432d6b64a6d33c6f065c9a945))

# [1.0.0-test.9](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.0.0-test.8...v1.0.0-test.9) (2021-10-04)


### Features

* **browser-extension:** Add scrapper results list view ([69bae04](https://github.com/TheUnderScorer/scrapper-gate/commit/69bae04fa51604ffa9de4d8009ee4ce03906a95d))

# [1.0.0-test.8](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.0.0-test.7...v1.0.0-test.8) (2021-09-28)


### Features

* **ui:** Persist open state of resizable panel ([1d44f11](https://github.com/TheUnderScorer/scrapper-gate/commit/1d44f115ed2fa05875a8b3875b5dde98f34f4cdc))

# [1.0.0-test.7](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.0.0-test.6...v1.0.0-test.7) (2021-09-22)


### Features

* **scrapper-run-result:** Hide duration if step is not completed ([23ed29a](https://github.com/TheUnderScorer/scrapper-gate/commit/23ed29af22816b35b995c9ddc94f28bb9c715ac5))

# [1.0.0-test.6](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.0.0-test.5...v1.0.0-test.6) (2021-09-17)


### Features

* **ui:** Show notice if form select is empty ([8d48024](https://github.com/TheUnderScorer/scrapper-gate/commit/8d48024cbc382a6567dee3220356c1449da3fb4b))

# [1.0.0-test.5](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.0.0-test.4...v1.0.0-test.5) (2021-09-14)


### Bug Fixes

* **block-editor:** Fix typing when field was empty ([3830835](https://github.com/TheUnderScorer/scrapper-gate/commit/3830835b7026067d6169eed66deda9f820a343f4))
* **scrapper-builder:** Keep state after switching tabs ([553eeab](https://github.com/TheUnderScorer/scrapper-gate/commit/553eeab0d263cfb2fe31b2de165bc663f35d4438))


### Features

* **form:** Show alert if form has unsaved changes ([1d50ed7](https://github.com/TheUnderScorer/scrapper-gate/commit/1d50ed7c5b4a083692710252b73016169e17314d))

# [1.0.0-test.4](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.0.0-test.3...v1.0.0-test.4) (2021-09-13)


### Bug Fixes

* **flow-builder:** Fix disappearing left handle after saving in first node ([3ae961d](https://github.com/TheUnderScorer/scrapper-gate/commit/3ae961d8524aa462781533e01ee0dbc9fa4d1790))
* **scrapper-builder:** Persist start node position ([1f245e0](https://github.com/TheUnderScorer/scrapper-gate/commit/1f245e073a1feacc2f55e6e3d2666e83501c1a4d))

# [1.0.0-test.3](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.0.0-test.2...v1.0.0-test.3) (2021-09-13)


### Bug Fixes

* Replace draft-js with slate ([39ddc3c](https://github.com/TheUnderScorer/scrapper-gate/commit/39ddc3cff26b883b2d80777ec720c8f797618ba9))

# [1.0.0-test.2](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.0.0-test.1...v1.0.0-test.2) (2021-09-04)


### Features

* Add scrapper screenshot action ([5cd5517](https://github.com/TheUnderScorer/scrapper-gate/commit/5cd55170267c9a5975315b48a994a50b2428a6f9))

# 1.0.0-test.1 (2021-08-15)


### Features

* Add "Variable" conditional rule ([c21a063](https://github.com/TheUnderScorer/scrapper-gate/commit/c21a0633133f7400ffc18e0bf2034575575a839d))
* Add PlayWright scrapper runner ([4aac1db](https://github.com/TheUnderScorer/scrapper-gate/commit/4aac1db7deeaa9389e71e2b97ea13572e2d886b3))
* Add run scrapper dialog ([7c22fa2](https://github.com/TheUnderScorer/scrapper-gate/commit/7c22fa25105b0f7a60fbe5d81690a427547d32d0))
* Add variable text field component ([9910e08](https://github.com/TheUnderScorer/scrapper-gate/commit/9910e08eec354ee6b00c67a86e167b5dcaf030e7))
* Display scrapper key inside node ([afe0e96](https://github.com/TheUnderScorer/scrapper-gate/commit/afe0e96555af36e5e57b13b2561106e55b37c1dd))
* Display scrapper run result ([2bb66a3](https://github.com/TheUnderScorer/scrapper-gate/commit/2bb66a34c0b9cf344e3fd47e24b34c66a302d839))
* Ensure that scrapper and variable key are unique ([46a10bc](https://github.com/TheUnderScorer/scrapper-gate/commit/46a10bc611b4940a9d0fc7fb87590f12615468b8))
* Resolve conditional rules ([deb5427](https://github.com/TheUnderScorer/scrapper-gate/commit/deb542739b46ebe36cb3acbb574e69626063f4ce))
* Resolve variables ([f440774](https://github.com/TheUnderScorer/scrapper-gate/commit/f440774083eadff4fbc795765561a1b234bcf281))
* Store variables in scrapper ([b6fa067](https://github.com/TheUnderScorer/scrapper-gate/commit/b6fa0674c3b99da248de0d07c836fc5ee6c2548f))
* Support setting initial url in scrapper start node ([a8937b9](https://github.com/TheUnderScorer/scrapper-gate/commit/a8937b9c190d1614579ddb15c6b12af82d2914d9))
* **api:** Add "GetMyScrappers" query ([5c2e3c3](https://github.com/TheUnderScorer/scrapper-gate/commit/5c2e3c3be36f22314ac52b2cf905869e108ab823))
* **api:** Handle user creation ([d46be8b](https://github.com/TheUnderScorer/scrapper-gate/commit/d46be8bdd92d290b7efd0ad12de38206cea7a907))
* **api:** Send scrapper to runner queue ([4fd703b](https://github.com/TheUnderScorer/scrapper-gate/commit/4fd703b8ca0b721a67d3c6b1f121128e1b51a9bf))
* **backend:** Add lambda function for running scrapper ([77a620e](https://github.com/TheUnderScorer/scrapper-gate/commit/77a620efb12b38fd84753e667c916841cbca2ff4))
* **browser-extension:** Add create scrapper view to content ([a86fe16](https://github.com/TheUnderScorer/scrapper-gate/commit/a86fe16b846b8af71a497b13b910a058fc3824de))
* Resolve variables in scrapper run ([1e38c0b](https://github.com/TheUnderScorer/scrapper-gate/commit/1e38c0be1bebea35680f134c755ea924f9015592))
* Support navigating to step url ([0bfba4a](https://github.com/TheUnderScorer/scrapper-gate/commit/0bfba4adfb321de60d2c754104d9ff286a9d58e8))
* **api:** Add "getMyScrapper" query ([de40115](https://github.com/TheUnderScorer/scrapper-gate/commit/de40115b21371aee2c69724b895350912d2dd899))
* **api:** Add Scrapper and ScrapperStep model entities ([12d757c](https://github.com/TheUnderScorer/scrapper-gate/commit/12d757cd23aca979f35f075293341c22ad73b026))
* **api:** Create scrapper ([781755a](https://github.com/TheUnderScorer/scrapper-gate/commit/781755a15615c9bf3065a1aead6688d5fe00eee7))
* **api:** Update scrapper ([e0dd46f](https://github.com/TheUnderScorer/scrapper-gate/commit/e0dd46ffa5c96aa2098d2ea4d387dc5f88976767))
* **browser-extension:** Add conditional section for scrapper ([3a75607](https://github.com/TheUnderScorer/scrapper-gate/commit/3a756076ad98e13b89415fdc6d019dda9ae4dd4e))
* **browser-extension:** Add drawer ([2d8df51](https://github.com/TheUnderScorer/scrapper-gate/commit/2d8df5137898db9ea05a56509211debc35961c4f))
* **browser-extension:** Handle signup ([04a2073](https://github.com/TheUnderScorer/scrapper-gate/commit/04a20739ff03a47277bb4e9864961e298d4e6699))
* **browser-extension:** Persist scrapper builder ([e6db4b0](https://github.com/TheUnderScorer/scrapper-gate/commit/e6db4b0c9a72a5269d31b52c59af662f1e3f1b73))
* Add login form ([f62230a](https://github.com/TheUnderScorer/scrapper-gate/commit/f62230a92685a90bba0844d369746186f1d39e6e))
* Initial project setup ([8c1d3a5](https://github.com/TheUnderScorer/scrapper-gate/commit/8c1d3a57a29728dac095b41c82be02aa19162930))


### Performance Improvements

* **browser-extension:** :zap: Optimized TextFieldBlock ([43dad36](https://github.com/TheUnderScorer/scrapper-gate/commit/43dad36d2cfdd5af267db4c2373fd3d1932f9fe6))

# [1.9.0](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.8.0...v1.9.0) (2021-07-30)


### Features

* Support setting initial url in scrapper start node ([a8937b9](https://github.com/TheUnderScorer/scrapper-gate/commit/a8937b9c190d1614579ddb15c6b12af82d2914d9))

# [1.8.0](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.7.0...v1.8.0) (2021-07-19)


### Features

* Add "Variable" conditional rule ([c21a063](https://github.com/TheUnderScorer/scrapper-gate/commit/c21a0633133f7400ffc18e0bf2034575575a839d))

# [1.7.0](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.6.0...v1.7.0) (2021-07-19)


### Features

* Add run scrapper dialog ([7c22fa2](https://github.com/TheUnderScorer/scrapper-gate/commit/7c22fa25105b0f7a60fbe5d81690a427547d32d0))
* **api:** Send scrapper to runner queue ([4fd703b](https://github.com/TheUnderScorer/scrapper-gate/commit/4fd703b8ca0b721a67d3c6b1f121128e1b51a9bf))
* **backend:** Add lambda function for running scrapper ([77a620e](https://github.com/TheUnderScorer/scrapper-gate/commit/77a620efb12b38fd84753e667c916841cbca2ff4))
* **browser-extension:** Add create scrapper view to content ([a86fe16](https://github.com/TheUnderScorer/scrapper-gate/commit/a86fe16b846b8af71a497b13b910a058fc3824de))


### Performance Improvements

* **browser-extension:** :zap: Optimized TextFieldBlock ([43dad36](https://github.com/TheUnderScorer/scrapper-gate/commit/43dad36d2cfdd5af267db4c2373fd3d1932f9fe6))

# [1.6.0](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.5.0...v1.6.0) (2021-06-25)


### Features

* Display scrapper key inside node ([afe0e96](https://github.com/TheUnderScorer/scrapper-gate/commit/afe0e96555af36e5e57b13b2561106e55b37c1dd))
* Ensure that scrapper and variable key are unique ([46a10bc](https://github.com/TheUnderScorer/scrapper-gate/commit/46a10bc611b4940a9d0fc7fb87590f12615468b8))

# [1.5.0](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.4.0...v1.5.0) (2021-06-21)


### Features

* Support navigating to step url ([0bfba4a](https://github.com/TheUnderScorer/scrapper-gate/commit/0bfba4adfb321de60d2c754104d9ff286a9d58e8))

# [1.4.0](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.3.0...v1.4.0) (2021-05-27)


### Features

* Add variable text field component ([9910e08](https://github.com/TheUnderScorer/scrapper-gate/commit/9910e08eec354ee6b00c67a86e167b5dcaf030e7))
* Resolve variables ([f440774](https://github.com/TheUnderScorer/scrapper-gate/commit/f440774083eadff4fbc795765561a1b234bcf281))
* Resolve variables in scrapper run ([1e38c0b](https://github.com/TheUnderScorer/scrapper-gate/commit/1e38c0be1bebea35680f134c755ea924f9015592))
* Store variables in scrapper ([b6fa067](https://github.com/TheUnderScorer/scrapper-gate/commit/b6fa0674c3b99da248de0d07c836fc5ee6c2548f))

# [1.3.0](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.2.0...v1.3.0) (2021-05-19)


### Features

* Add PlayWright scrapper runner ([4aac1db](https://github.com/TheUnderScorer/scrapper-gate/commit/4aac1db7deeaa9389e71e2b97ea13572e2d886b3))
* Resolve conditional rules ([deb5427](https://github.com/TheUnderScorer/scrapper-gate/commit/deb542739b46ebe36cb3acbb574e69626063f4ce))

# [1.2.0](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.1.0...v1.2.0) (2021-05-14)


### Features

* **api:** Add "getMyScrapper" query ([de40115](https://github.com/TheUnderScorer/scrapper-gate/commit/de40115b21371aee2c69724b895350912d2dd899))
* **api:** Add "GetMyScrappers" query ([5c2e3c3](https://github.com/TheUnderScorer/scrapper-gate/commit/5c2e3c3be36f22314ac52b2cf905869e108ab823))
* **api:** Add Scrapper and ScrapperStep model entities ([12d757c](https://github.com/TheUnderScorer/scrapper-gate/commit/12d757cd23aca979f35f075293341c22ad73b026))
* **api:** Create scrapper ([781755a](https://github.com/TheUnderScorer/scrapper-gate/commit/781755a15615c9bf3065a1aead6688d5fe00eee7))
* **api:** Update scrapper ([e0dd46f](https://github.com/TheUnderScorer/scrapper-gate/commit/e0dd46ffa5c96aa2098d2ea4d387dc5f88976767))
* **browser-extension:** Add conditional section for scrapper ([3a75607](https://github.com/TheUnderScorer/scrapper-gate/commit/3a756076ad98e13b89415fdc6d019dda9ae4dd4e))
* **browser-extension:** Add drawer ([2d8df51](https://github.com/TheUnderScorer/scrapper-gate/commit/2d8df5137898db9ea05a56509211debc35961c4f))
* **browser-extension:** Persist scrapper builder ([e6db4b0](https://github.com/TheUnderScorer/scrapper-gate/commit/e6db4b0c9a72a5269d31b52c59af662f1e3f1b73))

# [1.1.0](https://github.com/TheUnderScorer/scrapper-gate/compare/v1.0.0...v1.1.0) (2021-04-09)


### Features

* **api:** Handle user creation ([d46be8b](https://github.com/TheUnderScorer/scrapper-gate/commit/d46be8bdd92d290b7efd0ad12de38206cea7a907))
* **browser-extension:** Handle signup ([04a2073](https://github.com/TheUnderScorer/scrapper-gate/commit/04a20739ff03a47277bb4e9864961e298d4e6699))
* Add login form ([f62230a](https://github.com/TheUnderScorer/scrapper-gate/commit/f62230a92685a90bba0844d369746186f1d39e6e))

# 1.0.0 (2021-04-06)

### Features

- Initial project setup ([8c1d3a5](https://github.com/TheUnderScorer/scrapper-gate/commit/8c1d3a57a29728dac095b41c82be02aa19162930))
