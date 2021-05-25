import matcher from 'matcher';
import yargs from 'yargs';
import { projects } from '../../workspace.json';

const argv = yargs(process.argv.slice(2)).argv as any;

const projectsArray = Object.keys(projects);

const result = argv.filter
  ? matcher(projectsArray, argv.filter)
  : projectsArray;

process.stdout.write(result.join(','));
