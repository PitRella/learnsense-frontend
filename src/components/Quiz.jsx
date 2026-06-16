import { useState } from 'react'

import { useAddQuestion, useQuiz, useSubmitQuiz } from '../hooks/useApi'
import { Button } from './ui/Button'
import { Field } from './ui/Field'
import { Spinner } from './ui/Spinner'
import styles from './Quiz.module.css'

export function Quiz({ materialId, isTeacher }) {
  const { data, isLoading } = useQuiz(materialId)

  if (isLoading) return <Spinner label="Завантаження тесту…" />

  const questions = data?.questions || []

  return (
    <div className={styles.quiz}>
      {questions.length > 0 ? (
        <QuizRunner materialId={materialId} questions={questions} />
      ) : (
        <p style={{ color: 'var(--ink-soft)' }}>
          {isTeacher
            ? 'Тест порожній. Додайте перше питання нижче.'
            : 'Тест ще готується викладачем.'}
        </p>
      )}
      {isTeacher && <QuestionAuthor materialId={materialId} />}
    </div>
  )
}

function QuizRunner({ materialId, questions }) {
  const [picked, setPicked] = useState({})
  const [result, setResult] = useState(null)
  const submit = useSubmitQuiz(materialId)

  const allAnswered = questions.every((q) => picked[q.id] != null)

  function onSubmit() {
    const answers = questions.map((q) => ({
      question_id: q.id,
      selected_option_id: picked[q.id],
    }))
    submit.mutate(answers, { onSuccess: setResult })
  }

  if (result) {
    const passed = result.score >= 50
    return (
      <div className={styles.result}>
        <span
          className={`${styles.scoreBig} ${
            passed ? styles.scorePass : styles.scoreRisk
          }`}
        >
          {Math.round(result.score)}
        </span>
        <div>
          <div className={styles.resultMeta}>
            Правильних {result.correct} з {result.total} · спроба{' '}
            {result.attempts}
          </div>
          <div className={styles.resultNote}>
            Результат врахується в інтегральному індексі успішності.
          </div>
          <div style={{ marginTop: 'var(--sp-3)' }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setResult(null)
                setPicked({})
              }}
            >
              Пройти ще раз
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {questions.map((q, i) => (
        <div key={q.id} className={styles.question}>
          <div className={styles.qText}>
            {i + 1}. {q.text}
          </div>
          <div className={styles.options}>
            {q.options.map((opt) => (
              <label
                key={opt.id}
                className={`${styles.option} ${
                  picked[q.id] === opt.id ? styles.optionChecked : ''
                }`}
              >
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  checked={picked[q.id] === opt.id}
                  onChange={() =>
                    setPicked((p) => ({ ...p, [q.id]: opt.id }))
                  }
                />
                {opt.text}
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className={styles.submitRow}>
        <Button onClick={onSubmit} disabled={!allAnswered || submit.isPending}>
          {submit.isPending ? 'Перевірка…' : 'Завершити тест'}
        </Button>
        {!allAnswered && (
          <span style={{ color: 'var(--ink-faint)', fontSize: 'var(--text-sm)' }}>
            Дайте відповідь на всі питання
          </span>
        )}
      </div>
    </>
  )
}

const EMPTY_OPTIONS = [
  { text: '', correct: true },
  { text: '', correct: false },
  { text: '', correct: false },
]

function QuestionAuthor({ materialId }) {
  const add = useAddQuestion(materialId)
  const [text, setText] = useState('')
  const [options, setOptions] = useState(EMPTY_OPTIONS)

  const valid =
    text.trim() && options.filter((o) => o.text.trim()).length >= 2

  function submit(e) {
    e.preventDefault()
    const payload = {
      text: text.trim(),
      options: options
        .filter((o) => o.text.trim())
        .map((o) => ({ text: o.text.trim(), is_correct: o.correct })),
    }
    add.mutate(payload, {
      onSuccess: () => {
        setText('')
        setOptions(EMPTY_OPTIONS)
      },
    })
  }

  return (
    <form className={styles.author} onSubmit={submit}>
      <span className={styles.authorTitle}>Нове питання</span>
      <Field
        placeholder="Текст питання"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {options.map((opt, i) => (
        <div key={i} className={styles.optEdit}>
          <input
            type="text"
            placeholder={`Варіант ${i + 1}`}
            value={opt.text}
            onChange={(e) =>
              setOptions((prev) =>
                prev.map((o, j) =>
                  j === i ? { ...o, text: e.target.value } : o,
                ),
              )
            }
          />
          <label>
            <input
              type="radio"
              name="correct"
              checked={opt.correct}
              onChange={() =>
                setOptions((prev) =>
                  prev.map((o, j) => ({ ...o, correct: j === i })),
                )
              }
            />
            правильний
          </label>
        </div>
      ))}
      <div>
        <Button
          variant="ghost"
          size="sm"
          type="submit"
          disabled={!valid || add.isPending}
        >
          {add.isPending ? 'Додавання…' : 'Додати питання'}
        </Button>
      </div>
    </form>
  )
}
