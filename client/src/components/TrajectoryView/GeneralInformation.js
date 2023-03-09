import ListManager from "./ListManager";
import QuestionGroup from "./QuestionGroup";
import {v4 as genId} from 'uuid';


export default function GeneralInformation({
  lang,
  trajectory,
  register,
  control,
  getValues,
  setValue,
}) {
  return (
    <div className="GeneralInformation">
      <QuestionGroup
        question="Quel est le nom du projet de recherche dont est issue la trajectoire d'implication ?"
      >
        <input defaultValue={trajectory.trajectory_name} {...register("trajectory_name")} />
      </QuestionGroup>
      <QuestionGroup
        question="Quels sont les URLs du projet  en question ?"
      >
        <ListManager
          // fieldName="trajectory_URLs"
          items={getValues("trajectory_URLs") || []}
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
                <div className="subgroup">
                  <label>
                    URL
                  </label>
                  <input
                    {...register(`trajectory_URLs.${index}.URL`)} 
                  />
                </div>
                <div className="subgroup">
                  <label>
                    description
                  </label>
                  <input
                    {...register(`trajectory_URLs.${index}.description`)} 
                  />
                </div>
                
              </div>
            )
          }}
        />
      </QuestionGroup>
      <QuestionGroup
        question="Quel est le concernement social ou le problème public auquel la trajectoire d'implication entend répondre ?"
      >
        <input defaultValue={trajectory.concern} {...register("concern")} />
      </QuestionGroup>
    </div>
  )
}