import {v4 as genId} from 'uuid';
import Textarea from 'react-textarea-autosize';

import ListManager from "./ListManager";
import QuestionGroup from "./QuestionGroup";
import { translate } from '../../utils';


export default function GeneralInformation({
  lang,
  trajectory,
  register,
  getValues,
  setValue,
}) {
  return (
    <div className="GeneralInformation">
      <h2 className="part-title">
        {translate('general_questions_title', lang)}
      </h2>
      <QuestionGroup
        question={translate('project_name_question', lang)}
      >
        <input defaultValue={trajectory.trajectory_name} {...register("trajectory_name")} />
      </QuestionGroup>
      <QuestionGroup
        question={translate('project_urls_question', lang)}
      >
        <ListManager
          // fieldName="trajectory_URLs"
          items={getValues("trajectory_URLs") || []}
          lang={lang}
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
      </QuestionGroup>
      <QuestionGroup
        question={translate('social_concern_question', lang)}
      >
        <Textarea defaultValue={trajectory.concern} {...register("concern")} />
      </QuestionGroup>
      <QuestionGroup
        question={translate('social_concern_question', lang)}
      >
        <Textarea defaultValue={trajectory.contact_email} {...register("contact_email")} />
      </QuestionGroup>
    </div>
  )
}