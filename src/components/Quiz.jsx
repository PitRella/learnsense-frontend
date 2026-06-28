import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'

import {
  useAddQuestion,
  useQuiz,
  useRecommendations,
  useSubmitQuiz,
  useUpdateRecommendation,
} from '../hooks/useApi'
import { RecommendationCard } from './RecommendationsPanel'
import { Button } from './ui/Button'
import { Field } from './ui/Field'
import { Icon } from './ui/Icon'
import { Spinner } from './ui/Spinner'
import styles from './Quiz.module.css'

export function Quiz({ materialId, moduleId, isTeacher }) {
  const { data, isLoading } = useQuiz(materialId)

  if (isLoading) return <Spinner label="Завантаження тесту…" />

  const questions = data?.questions || []

  return (
    <div className={styles.quiz}>
      {questions.length > 0 ? (
        <QuizRunner
          materialId={materialId}
          moduleId={moduleId}
          questions={questions}
        />
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

function QuizRunner({ materialId, moduleId, questions }) {
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

  function retry() {
    setResult(null)
    setPicked({})
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

      <AnimatePresence>
        {result && (
          <TestResultModal
            result={result}
            moduleId={moduleId}
            onRetry={retry}
            onClose={() => setResult(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// Pop-up shown right after a test: the score, plus the personal advice the
// analytics engine produces for this module - revealed as it arrives,
// rather than tucked away on a separate tab.
function TestResultModal({ result, moduleId, onRetry, onClose }) {
  const passed = result.score >= 50
  const { data } = useRecommendations({ poll: true })
  const update = useUpdateRecommendation()
  const [waited, setWaited] = useState(false)

  const recs = useMemo(() => {
    const byKey = new Map()
    for (const r of data || []) {
      if (moduleId && r.module_id !== moduleId) continue
      const prev = byKey.get(r.recommendation_type)
      if (!prev || r.id > prev.id) byKey.set(r.recommendation_type, r)
    }
    return [...byKey.values()]
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, 2)
  }, [data, moduleId])

  // Give the asynchronous engine a window to produce advice before we fall
  // back to a generic message.
  useEffect(() => {
    const timer = setTimeout(() => setWaited(true), 16000)
    return () => clearTimeout(timer)
  }, [])

  // Lock background scroll and close on Escape while the dialog is open.
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <motion.div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Закрити"
        >
          <Icon name="x" size={18} />
        </button>

        <div className={styles.resultHead}>
          <span
            className={`${styles.scoreBig} ${
              passed ? styles.scorePass : styles.scoreRisk
            }`}
          >
            {Math.round(result.score)}
          </span>
          <div>
            <div className={styles.modalTitle}>
              {passed ? 'Тест складено' : 'Тест не складено'}
            </div>
            <div className={styles.resultMeta}>
              Правильних {result.correct} з {result.total} · спроба{' '}
              {result.attempts}
            </div>
            <div className={styles.resultNote}>
              Результат враховано в інтегральному індексі успішності.
            </div>
          </div>
        </div>

        <div className={styles.recArea}>
          {recs.length > 0 ? (
            <>
              <p className={styles.recLead}>
                {passed
                  ? 'Що варто зробити далі'
                  : 'Персональна рекомендація'}
              </p>
              {recs.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  rec={rec}
                  pending={update.isPending}
                  onMark={(status) => update.mutate({ id: rec.id, status })}
                  onNavigate={onClose}
                />
              ))}
            </>
          ) : waited ? (
            <p className={styles.recHint}>
              {passed
                ? 'Так тримати - гарний результат! Можна переходити далі.'
                : 'Радимо переглянути матеріал ще раз і спробувати знову.'}
            </p>
          ) : (
            <div className={styles.analyzing}>
              <Spinner size={18} />
              <span>
                Аналізуємо результат і готуємо персональну пораду…
              </span>
            </div>
          )}
        </div>

        <div className={styles.modalActions}>
          <Button variant="ghost" onClick={onRetry}>
            Пройти ще раз
          </Button>
          <Button onClick={onClose}>Закрити</Button>
        </div>
      </motion.div>
    </motion.div>
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
