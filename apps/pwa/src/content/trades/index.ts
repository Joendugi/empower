import { allFromProgrammes } from './build';
import { sewingProgramme } from './fashion';
import { bodyWorksProgramme, refrigerationProgramme, weldingProgramme } from './metal';
import {
  carpentryProgramme,
  electricalProgramme,
  masonryProgramme,
  plumbingProgramme,
} from './building';
import { vehicleAnatomyProgramme } from './anatomy';
import {
  agricultureProgramme,
  automotiveProgramme,
  hairdressingProgramme,
  hospitalityProgramme,
} from './services';
import { societyProgrammes } from './society';

export const tradeProgrammes = [
  sewingProgramme,
  weldingProgramme,
  electricalProgramme,
  plumbingProgramme,
  masonryProgramme,
  carpentryProgramme,
  vehicleAnatomyProgramme,
  automotiveProgramme,
  hairdressingProgramme,
  hospitalityProgramme,
  agricultureProgramme,
  refrigerationProgramme,
  bodyWorksProgramme,
  ...societyProgrammes,
];

const assembled = allFromProgrammes(tradeProgrammes);

export const tradeLessons = assembled.tradeLessons;
export const tradePaths = assembled.tradePaths;
