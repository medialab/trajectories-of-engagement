import { v4 as genId } from 'uuid';
import Textarea from 'react-textarea-autosize';
import { useMemo, useState, useEffect } from 'react';
import Select from 'react-select';

import ListManager from "./ListManager";
import QuestionGroup from "./QuestionGroup";
import { translate } from '../../utils';
// import YesNoRadio from './YesNoRadio';
import Phases, { PHASES_TYPES } from './Phases';
import Actors from './Actors';

const PhaseEditor = ({
  lang,
  trajectory,
  phase,
  register,
  getValues,
  control,
  setValue,
  phaseIndex,
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
        {phaseIndex + 1}. {phase.name}
      </h2>

      <QuestionGroup
        question={translate('research_phase_name_question', lang)}
      >
        <input
          placeholder={translate('research_phase_name_question', lang)}
          {...register(`phases.${phaseIndex}.name`)}
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
          onChange={({ value }) => setValue(`phases.${phaseIndex}.type`, value)}
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
              setValue(`phases.${phaseIndex}.actors_ids`, ids)
            },
          }}
        />
      </QuestionGroup>
      <QuestionGroup
        question={translate('research_phase_externals_agency_question', lang)}
      >
        <Textarea defaultValue={trajectory.external_actors_agency} {...register(`phases.${phaseIndex}.external_actors_agency`)} />
      </QuestionGroup>
      <QuestionGroup
        question={translate('research_phase_digital_question', lang)}
      >
        <Textarea defaultValue={trajectory.digital_tools_details} {...register(`phases.${phaseIndex}.digital_tools_details`)} />
      </QuestionGroup>
      <QuestionGroup
        question={translate('research_phase_devices_traces_question', lang)}
      >
        <p>
          <i>
            {translate('research_phase_device_select_prompt', lang)}
          </i>
        </p>
        <ListManager
          items={getValues(`tracing_devices`) || []}
          lang={lang}
          isMinified={true}
          isSelectable={true}
          renderMinifiedHeader={(item) => <span>{item.name || translate('research_phase_resource_unnamed_device', lang)}</span>}
          selectedItemsIds={phase.tracing_devices_ids || []}
          onSelectItem={(id) => {
            const existing = phase.tracing_devices_ids || [];
            let newList;
            if (existing.includes(id)) {
              newList = existing.filter(i => i !== id);
            } else {
              newList = [...existing, id];
            }
            setValue(`phases.${phaseIndex}.tracing_devices_ids`, newList);
          }}
          messageAddItem={translate('research_phase_add_device_btn', lang)}
          onNewItem={() => {
            const newItem = {
              id: genId(),
              name: ''
            }
            const existingItems = getValues(`tracing_devices`) || [];
            const newItems = [...existingItems, newItem];
            setValue(`tracing_devices`, newItems);
          }}
          onUpdateItems={(newItems) => {
            setValue(`tracing_devices`, newItems);
          }}
          renderItem={(item, itemIndex) => {
            return (
              <div key={item.id} className="item">
                <div className="input-group">
                  <label>
                    {translate('research_phase_device_name_prompt', lang)}
                  </label>
                  <input
                    placeholder={translate('research_phase_device_name_prompt', lang)}
                    {...register(`tracing_devices.${itemIndex}.name`)}
                  />
                </div>
              </div>
            )
          }}
        />
      </QuestionGroup>
      <QuestionGroup
        question={translate('research_phase_resources_question', lang)}
      >
        <p>
          <i>
            {translate('research_phase_resource_select_prompt', lang)}
          </i>
        </p>
        <ListManager
          items={getValues(`resources`) || []}
          lang={lang}
          isMinified={true}
          isSelectable={true}
          renderMinifiedHeader={(item) => <span>{item.name || translate('research_phase_resource_unnamed_resource', lang)}</span>}
          selectedItemsIds={phase.resources_ids || []}
          onSelectItem={(id) => {
            const existing = phase.resources_ids || [];
            let newList;
            if (existing.includes(id)) {
              newList = existing.filter(i => i !== id);
            } else {
              newList = [...existing, id];
            }
            setValue(`phases.${phaseIndex}.resources_ids`, newList);
          }}
          messageAddItem={translate('research_phase_add_resource_btn', lang)}
          onNewItem={() => {
            const newItem = {
              id: genId(),
              name: '',
              acquisition_mode: '',
              provenance_actors_ids: []
            }
            const existingItems = getValues(`resources`) || [];
            const newItems = [...existingItems, newItem];
            setValue(`resources`, newItems);
          }}
          onUpdateItems={(newItems) => {
            setValue(`resources`, newItems);
          }}
          renderItem={(item, itemIndex) => {
            return (
              <div key={item.id} className="item">
                <div className="input-group">
                  <label>
                    {translate('research_phase_resource_name_prompt', lang)}
                  </label>
                  <Textarea
                    placeholder={translate('research_phase_resource_name_prompt', lang)}
                    {...register(`resources.${itemIndex}.name`)}
                  />
                </div>
                <div className="input-group">
                  <label>
                    {translate('research_phase_resource_acquisition_mode_prompt', lang)}
                  </label>
                  <Textarea
                    placeholder={translate('research_phase_resource_acquisition_mode_prompt', lang)}
                    {...register(`resources.${itemIndex}.acquisition_mode`)}
                  />
                </div>
                <div className="input-group">
                  <label>
                    {translate('research_phase_resource_actors_prompt', lang)}
                  </label>
                  <Actors
                    {...{
                      lang,
                      trajectory,
                      register,
                      getValues,
                      setValue,
                      isMinified: true,
                      isSelectable: true,
                      selectedIds: getValues(`resources.${itemIndex}.from_actors_ids`) || [],
                      onSelectionChange: ids => {
                        setValue(`resources.${itemIndex}.from_actors_ids`, ids)
                      },
                    }}
                  />
                </div>
              </div>
            )
          }}
        />
      </QuestionGroup>
      <QuestionGroup
        question={translate('research_phase_materials_question', lang)}
      >
        <ListManager
          items={getValues(`phase.${phaseIndex}.materials`) || []}
          lang={lang}
          isMinified={false}
          isSelectable={false}
          // renderMinifiedHeader={(item) => <span>{item.name || translate('research_phase_resource_unnamed_resource', lang)}</span>}
          // selectedItemsIds={phase.resources_ids || []}
          // onSelectItem={(id) => {
          //   const existing = phase.resources_ids || [];
          //   let newList;
          //   if (existing.includes(id)) {
          //     newList = existing.filter(i => i !== id);
          //   } else {
          //     newList = [...existing, id];
          //   }
          //   setValue(`phases.${phaseIndex}.resources_ids`, newList);
          // }}
          messageAddItem={translate('research_phase_add_material_btn', lang)}
          onNewItem={() => {
            const newItem = {
              id: genId(),
              name: '',
              from_actors_ids: [],
              for_actors_ids: []
            }
            const existingItems = getValues(`phase.${phaseIndex}.materials`) || [];
            const newItems = [...existingItems, newItem];
            setValue(`phase.${phaseIndex}.materials`, newItems);
          }}
          onUpdateItems={(newItems) => {
            setValue(`phase.${phaseIndex}.materials`, newItems);
          }}
          renderItem={(item, itemIndex) => {
            return (
              <div key={item.id} className="item">
                <div className="input-group">
                  <label>
                    {translate('research_phase_material_name_prompt', lang)}
                  </label>
                  <input
                    placeholder={translate('research_phase_material_name_prompt', lang)}
                    {...register(`phase.${phaseIndex}.materials.${itemIndex}.name`)}
                  />
                </div>
                <div className="input-group">
                  <label>
                    {translate('research_phase_material_URL_prompt', lang)}
                  </label>
                  <input
                    placeholder={translate('research_phase_material_URL_prompt', lang)}
                    {...register(`phase.${phaseIndex}.materials.${itemIndex}.URL`)}
                  />
                </div>
                <div className="input-group">
                  <label>
                    {translate('research_phase_material_comments_prompt', lang)}
                  </label>
                  <Textarea
                    placeholder={translate('research_phase_material_comments_prompt', lang)}
                    {...register(`phase.${phaseIndex}.materials.${itemIndex}.comments`)}
                  />
                </div>
                
                <div className="input-group">
                  <label>
                    {translate('research_phase_material_from_actors_question', lang)}
                  </label>
                  <Actors
                    {...{
                      lang,
                      trajectory,
                      register,
                      getValues,
                      setValue,
                      isMinified: true,
                      isSelectable: true,
                      selectedIds: getValues(`phase.${phaseIndex}.materials.${itemIndex}.from_actors_ids`) || [],
                      onSelectionChange: ids => {
                        setValue(`phase.${phaseIndex}.materials.${itemIndex}.from_actors_ids`, ids)
                      },
                    }}
                  />
                </div>
                <div className="input-group">
                  <label>
                    {translate('research_phase_material_for_actors_question', lang)}
                  </label>
                  <Actors
                    {...{
                      lang,
                      trajectory,
                      register,
                      getValues,
                      setValue,
                      isMinified: true,
                      isSelectable: true,
                      selectedIds: getValues(`phase.${phaseIndex}.materials.${itemIndex}.for_actors_ids`) || [],
                      onSelectionChange: ids => {
                        setValue(`phase.${phaseIndex}.materials.${itemIndex}.for_actors_ids`, ids)
                      },
                    }}
                  />
                </div>
              </div>
            )
          }}
        />
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
                phaseIndex: activePhaseIndex,
              }}
            />
            : <span>{translate('research_phase_details_none_selected', lang)}</span>
        }
      </div>
    </div>
  )
}