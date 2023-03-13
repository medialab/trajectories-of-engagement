import { v4 as genId } from 'uuid';
import Textarea from 'react-textarea-autosize';

import ListManager from "./ListManager";
import QuestionGroup from "./QuestionGroup";
import { translate } from '../../utils';
import YesNoRadio from './YesNoRadio';
import { useMemo, useState, useEffect } from 'react';
import Select from 'react-select';

const ACTOR_TYPES = ['individual', 'laboratory', 'company', 'ngo', 'other'];

const ActorItem = ({
  actor,
  lang,
  register,
  actorTypesOptions,
  index,
  setValue,
}) => {

  return (
    <div className={`item`}>
      <div className="input-group">
        <label>
          {translate('actor_name', lang)}
        </label>
        <input
          placeholder="name"
          {...register(`actors.${index}.name`)}
        />
      </div>
      <div className="input-group">
        <label>
          {translate('actor_type', lang)}
        </label>
        <Select
          className="basic-single"
          classNamePrefix="select"
          defaultValue={actorTypesOptions[0]}
          value={actor.type ? actorTypesOptions.find(a => a.type === actor.type) : undefined}
          onChange={({ value }) => setValue(`actors.${index}.type`, value)}
          placeholder={translate('select', lang)}
          isClearable={false}
          isSearchable={false}
          name="actor-type"
          options={actorTypesOptions}
        />
        {/* <input
            placeholder="type"
            {...register(`actors.${index}.type`)}
          /> */}
      </div>
      <div className="input-group">
        <label>
          {translate('actor_notes', lang)}
        </label>
        <input
          placeholder={translate('actor_notes', lang)}
          {...register(`actors.${index}.notes`)}
        />
      </div>
      <div className="input-group">
        <label>
          {translate('actor_external', lang)}
        </label>
        <YesNoRadio
          {...{
            lang,
            value: actor.external,
            onChange: val => setValue(`actors.${index}.external`, val)
          }}
        />
      </div>
    </div>
  )
}
export default function Actors({
  lang,
  trajectory,
  register,
  getValues,
  setValue,
  isMinified,
  isSelectable,
  selectedIds,
  onSelectionChange,
}) {
  const actors = getValues('actors');

  const actorTypesOptions = useMemo(() =>
    ACTOR_TYPES.map(id => ({
      value: id,
      label: translate(`actors_typology_${id}`, lang)
    }))
    , [lang]);
  return (
    <div className={`Actors ${isMinified ? 'is-minified' : ''}`}>
      {
        !isSelectable &&
        <h2 className="part-title">
          {translate('trajectory_actors_title', lang)}
        </h2>
      }
      <QuestionGroup
        question={isSelectable ? '' : translate('actors_question', lang)}
      >
        {
          isSelectable ?
            <p>
              <i>
                {translate('research_phase_externals_detail_click_prompt', lang)}
              </i>
            </p>
            : null
        }
        <ListManager
          items={getValues("actors") || []}
          messageAddItem={translate('add_actor_button', lang)}
          isMinified={isMinified}
          lang={lang}
          renderMinifiedHeader={(actor) => <span>{actor.name} {actor.type ? ` (${translate(`actors_typology_${actor.type}`, lang)})` : ''}</span>}
          onNewItem={() => {
            const newItem = {
              id: genId(),
              name: '',
              notes: '',
              external: false
            }
            const existingActors = getValues("actors") || [];
            const newActors = [...existingActors, newItem];
            setValue("actors", newActors);
          }}
          onUpdateItems={(newActors) => {
            setValue("actors", newActors);
          }}
          renderItem={(item, index) => {
            const actor = actors[index];
            return (
              <ActorItem
                key={item.id}
                {...{
                  actor,
                  isMinified,
                  lang,
                  register,
                  actorTypesOptions,
                  index,
                  setValue,
                  
                }}
              />
            )

          }}
          {
            ...{
              isSelectable,
              selectedItemsIds: selectedIds || [],
              onSelectItem: (itemId, index) => {
                if ((selectedIds || []).includes(itemId)) {
                  onSelectionChange(
                    (selectedIds || [])
                    .filter(id => id !== itemId)
                  );
                } else {
                  onSelectionChange([
                    ...(selectedIds || []),
                    itemId,
                  ]);
                }
              }
            }
          }
        />
      </QuestionGroup>
      {
        !isSelectable &&
        <QuestionGroup
          question={translate('outside_definition_question', lang)}
        >
          <Textarea defaultValue={trajectory.outside_definition} {...register("outside_definition")} />
        </QuestionGroup>
      }

    </div>
  )
}