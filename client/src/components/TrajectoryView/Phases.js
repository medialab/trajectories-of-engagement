import {v4 as genId} from 'uuid';
// import Textarea from 'react-textarea-autosize';

import ListManager from "./ListManager";
import QuestionGroup from "./QuestionGroup";
import { translate } from '../../utils';
import YesNoRadio from './YesNoRadio';
import { useMemo } from 'react';
import Select from 'react-select';

export const PHASES_TYPES = [
  'problematization', 
  'hypotheses', 
  'data_collection', 
  'contact', 
  'fieldwork',
  'materials',
  'data_analysis',
  'data_interpretation',
  'dissemination',
];

const PhaseItem = ({
  phase,
  lang,
  register,
  phaseTypesOptions,
  index,
  setValue
}) => {
  return (
      <div className="item">
        <div className="input-group">
          <label>
            {translate('research_phase_name_question', lang)}
          </label>
          <input
            placeholder={translate('research_phase_name_question', lang)}
            {...register(`phases.${index}.name`)}
          />
        </div>
        <div className="input-group">
          <label>
            {translate('research_phase_type_question', lang)}
          </label>
          <Select
            className="basic-single"
            classNamePrefix="select"
            defaultValue={phaseTypesOptions[0]}
            value={phase.type ? phaseTypesOptions.find(a => a.type === phase.type) : undefined}
            onChange={({value}) => setValue(`phases.${index}.type`, value)}
            placeholder={translate('select', lang)}
            isClearable={false}
            isSearchable={false}
            name="phase-type"
            options={phaseTypesOptions}
          />
        </div>
        {/* <div className="input-group">
          <label>
            {translate('phase_notes', lang)}
          </label>
          <input
            placeholder={translate('phase_notes', lang)}
            {...register(`phases.${index}.notes`)}
          />
        </div> */}
        <div className="input-group">
          <label>
            {translate('research_phase_externals_question', lang)}
          </label>
          <YesNoRadio
            {...{
              lang,
              value: phase.external_involved,
              onChange: val => setValue(`phases.${index}.external_involved`, val)
            }}
          />
        </div>
      </div>
    )
}
export default function Phases({
  lang,
  trajectory,
  register,
  getValues,
  setValue,
  isMinified,
  isSelectable,
  selectedItemId,
  onSelectItem
}) {
  const phases = getValues('phases');

  const phaseTypesOptions = useMemo(() => 
  PHASES_TYPES.map(id => ({
      value: id,
      label: translate(`research_phase_typology_${id}`, lang)
    }))
  , [lang]);
  return (
    <div className={`Phases ${isMinified ? 'is-minified': ''}`}>
      {
        !isMinified &&
        <h2 className="part-title">
          {translate('trajectory_phases_title', lang)}
        </h2>
      }
      
      <QuestionGroup
        question={isMinified ? translate('research_phases_minified_title', lang) : translate('research_phase_intro_question', lang)}
      >
        <ListManager
          items={getValues("phases") || []}
          messageAddItem={translate('add_phase_button', lang)}
          isMinified={isMinified}
          lang={lang}
          renderMinifiedHeader={(phase, index) => <span>{index + 1}. {phase.name} {phase.type ? `(${translate(`research_phase_typology_${phase.type}`)})` : ''}</span>}
          onNewItem={() => {
            const newItem = {
              id: genId(),
              name: '',
              type: undefined,
            }
            const existingPhases = getValues("phases") || [];
            const newPhases = [...existingPhases, newItem];
            setValue("phases", newPhases);
          }}
          onUpdateItems={(newPhases) => {
            setValue("phases", newPhases);
          }}
          renderItem={(item, index) => {
            const phase = phases[index];
            return (
              <>
                <h3>Phase {index + 1}{phase.name ? ` : ${phase.name}` : ''}</h3>
                <PhaseItem
                key={item.id}
                {...{
                  phase,
                  isMinified,
                  lang,
                  register,
                  phaseTypesOptions,
                  index,
                  setValue,
                }}
              />
              </>
              
            )
            
          }}
          isSelectable={isSelectable}
          selectedItemId={selectedItemId}
          onSelectItem={onSelectItem}
        />
      </QuestionGroup>
    </div>
  )
}