import { exec } from 'child_process';
import { promisify } from 'util';

interface Options {
  textToEcho: string;
}

export default async function echo(options: Options) {
  console.info('Running echo...');

  const { stderr, stdout } = await promisify(exec)(
    `echo ${options.textToEcho}`
  );

  console.log(stderr);
  console.log(stdout);

  return {
    success: !stderr,
  };
}
