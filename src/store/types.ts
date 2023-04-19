import { SkillsTabState } from '../components/enums/SkillsTabState';
import { ChangedSkill } from '../models/ChangedSkill.interface';

export interface onCancelRoot {
  onCancel: {
    value: boolean;
  };
}

export interface ChangedSkillsDataRoot {
  changedSkills: {
    value: ChangedSkill[];
  };
}

export interface ViewStateRoot {
  viewState: {
    value: SkillsTabState;
  };
}

export interface LoadingRoot {
  loading: {
    value: boolean;
  };
}

export interface OnCancelRoot {
  onCancel: {
    value: boolean;
  };
}