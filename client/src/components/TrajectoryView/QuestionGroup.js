import slugify from 'slugify';
import copy from 'copy-to-clipboard';

export default function QuestionGroup ({
  question,
  indications,
  children,
  idPrefix = '',
  showAnchor = true
}) {
  const actualId = idPrefix + slugify(question);
  const onCopyLink = () => {
    let link = document.location.toString();
    if (!link.includes('?')) {
      link += '?';
    } else {
      link += '&';
    }
    link += 'question=' + actualId;
    copy(link);
    alert(`link copied to clipboard (${link})`);
  }
  return (
    <div className="QuestionGroup" id={actualId}>
      <h4 className="question">{question} {showAnchor ? <span className="question-anchor" onClick={onCopyLink} title={'copy question URL'}>🔗</span> : null}</h4>
      {
        indications ?
        <div className="indications">
          {indications}
        </div>
        : null
      }
      <div className="input-element-container">
        {children}
      </div>
    </div>
  )
}