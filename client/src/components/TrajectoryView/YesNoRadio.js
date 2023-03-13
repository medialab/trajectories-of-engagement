
import { translate } from '../../utils';

export default function YesNoRadio({
  value,
  onChange,
  lang
}) {
  return (
    <div className="radio-container">
          <label 
          onClick={e => {
            onChange( true)
          }}
          className={`${!!value ? 'is-active': ''}`} htmlFor="field-yes">
            {/* <input
              // {...register("interested_for_interview")}
              type="radio"
              // value={true}
              checked={value}
              
              id="field-yes"
            /> */}
            {translate('yes', lang)}
          </label>
          <label 
              onClick={e => onChange( false)}
              className={`${!value ? 'is-active': ''}`} htmlFor="field-no">
            {/* <input
              // {...register("interested_for_interview")}
              type="radio"
              // value={false}
              checked={!value}
              id="field-no"
            /> */}
             {translate('no', lang)}
          </label>
        </div>
  )
}