

export default function QuestionGroup ({
  question,
  indications,
  children
}) {
  return (
    <div className="QuestionGroup">
      <h4 className="question">{question}</h4>
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