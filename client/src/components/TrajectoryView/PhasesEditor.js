// import {v4 as genId} from 'uuid';
import Textarea from 'react-textarea-autosize';
import { useMemo, useState, useEffect } from 'react';
import Select from 'react-select';

// import ListManager from "./ListManager";
import QuestionGroup from "./QuestionGroup";
import { translate } from '../../utils';
import YesNoRadio from './YesNoRadio';
import Phases, {PHASES_TYPES} from './Phases';
import Actors from './Actors';

const PhaseEditor = ({
  lang,
  trajectory,
  phase,
  register,
  getValues,
  control,
  setValue,
  index,
}) => {
  const phaseTypesOptions = useMemo(() => 
  PHASES_TYPES.map(id => ({
      value: id,
      label: translate(`research_phase_typology_${id}`, lang)
    }))
  , [lang]);

  return (
    <div className="PhaseEditor">
      <h2>
        {index + 1}. {phase.name}
      </h2>

      <QuestionGroup
        question={translate('research_phase_name_question', lang)}
      >
        <input
          placeholder={translate('research_phase_name_question', lang)}
          {...register(`phases.${index}.name`)}
        />
      </QuestionGroup>
      <QuestionGroup
        question={translate('research_phase_type_question', lang)}
      >
        <Select
          className="basic-single"
          classNamePrefix="select"
          defaultValue={phaseTypesOptions[0]}
          value={phase.type ? phaseTypesOptions.find(a => a.type === phase.type) : undefined}
          onChange={({ value }) => setValue(`phases.${index}.type`, value)}
          placeholder={translate('select', lang)}
          isClearable={false}
          isSearchable={false}
          name="phase-type"
          options={phaseTypesOptions}
        />
      </QuestionGroup>
      <QuestionGroup
        question={translate('research_phase_externals_detail_question', lang)}
      >
        <Actors
          {...{
            lang,
            trajectory,
            register,
            getValues,
            setValue,
            isMinified: true,
            isSelectable: true,
            selectedIds: phase.actors_ids || [],
            onSelectionChange: ids => {
              setValue(`phases.${index}.actors_ids`, ids)
            },
          }}
        />
      </QuestionGroup>
      <QuestionGroup
        question={translate('research_phase_externals_agency_question', lang)}
      >
        <Textarea defaultValue={trajectory.external_actors_agency} {...register(`phases.${index}.external_actors_agency`)} />
      </QuestionGroup>
      <QuestionGroup
        question={translate('research_phase_digital_question', lang)}
      >
        <Textarea defaultValue={trajectory.digital_tools_details} {...register(`phases.${index}.digital_tools_details`)} />
      </QuestionGroup>
    </div>
  )
}


export default function PhasesEditor({
  lang,
  trajectory,
  register,
  getValues,
  control,
  setValue,
}) {
  const phases = trajectory.phases || [];

  const firstPhaseId = useMemo(() => {
    if (phases.length) {
      return phases[0].id;
    }
  }, []);

  const [activePhaseId, setActivePhaseId] = useState(firstPhaseId);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  useEffect(() => {
    if (activePhaseId) {
      let phaseIndex;
      const isInPhases = phases.find((p, i) => {
        if (p.id === activePhaseId) {
          phaseIndex = i;
          return true;
        }
        return false;
      });
      if (!isInPhases) {
        setActivePhaseId();
        setActivePhaseIndex();
      } else if (phaseIndex !== activePhaseIndex) {
        setActivePhaseIndex(phaseIndex);
      }
    }
  }, [phases, activePhaseId]);
  return (
    <div className="PhasesEditor">
      <Phases
        {...{
          trajectory,
          register,
          control,
          getValues,
          setValue,
          isMinified: true,
          isSelectable: true,
          selectedItemId: activePhaseId,
          onSelectItem: (id, index) => {
            setActivePhaseId(id);
            setActivePhaseIndex(index);
          },
          lang,
        }}
      />
      <div className="phase-detail">
        {
          activePhaseId ?
            <PhaseEditor
              {...{
                lang,
                trajectory,
                phase: phases[activePhaseIndex],
                register,
                getValues,
                control,
                setValue,
                index: activePhaseIndex,
              }}
            />
            : <span>{translate('research_phase_details_none_selected', lang)}</span>
        }
      </div>
    </div>
  )
}