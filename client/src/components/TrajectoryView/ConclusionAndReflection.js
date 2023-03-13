// import {v4 as genId} from 'uuid';
import Textarea from 'react-textarea-autosize';

// import ListManager from "./ListManager";
import QuestionGroup from "./QuestionGroup";
import { translate } from '../../utils';


export default function ConclusionAndReflection({
  lang,
  trajectory,
  register,
  getValues,
  setValue,
}) {
  return (
    <div className="ConclusionAndReflection">
      <QuestionGroup
        question={translate('effects_on_externals_question', lang)}
      >
        <Textarea defaultValue={trajectory.transformation_external} {...register("transformation_external")} />
      </QuestionGroup>
      <QuestionGroup
        question={translate('effects_on_internals_question', lang)}
      >
        <Textarea defaultValue={trajectory.transformation_internal} {...register("transformation_internal")} />
      </QuestionGroup>
      <QuestionGroup
        question={translate('perspectives_question', lang)}
      >
        <Textarea defaultValue={trajectory.perspectives} {...register("perspectives")} />
      </QuestionGroup>
      <QuestionGroup
        question={translate('accepts_interview_question', lang)}
      >
        <div className="radio-container">
          <label className={`${trajectory.interested_for_interview ? 'is-active': ''}`} htmlFor="field-yes">
            <input
              {...register("interested_for_interview")}
              type="radio"
              value={true}
              checked={trajectory.interested_for_interview}
              id="field-yes"
            />
            {translate('yes', lang)}
          </label>
          <label className={`${!trajectory.interested_for_interview ? 'is-active': ''}`} htmlFor="field-no">
            <input
              {...register("interested_for_interview")}
              type="radio"
              value={false}
              checked={!trajectory.interested_for_interview}
              id="field-no"
            />
             {translate('no', lang)}
          </label>
        </div>
      </QuestionGroup>
      {/* <QuestionGroup
        question={translate('project_urls_question', lang)}
      >
        <ListManager
          // fieldName="trajectory_URLs"
          items={getValues("trajectory_URLs") || []}
          messageAddItem={translate('add_url_button', lang)}
          onNewItem={() => {
            const newItem = {
              id: genId(),
              URL: '',
              description: ''
            }
            const existingURLs = getValues("trajectory_URLs") || [];
            const newURLs = [...existingURLs, newItem];
            setValue("trajectory_URLs", newURLs);
          }}
          onUpdateItems = {(newURLs) => {
            setValue("trajectory_URLs", newURLs);
          }}
          renderItem={(item, index) => {
            return (
              <div key={item.id} className="item">
                <div className="input-group">
                  <label>
                    URL
                  </label>
                  <input
                    placeholder="URL"
                    {...register(`trajectory_URLs.${index}.URL`)} 
                  />
                </div>
                <div className="input-group">
                  <label>
                    description
                  </label>
                  <input
                    placeholder="description"
                    {...register(`trajectory_URLs.${index}.description`)} 
                  />
                </div>
                
              </div>
            )
          }}
        />
      </QuestionGroup> */}
    </div>
  )
}