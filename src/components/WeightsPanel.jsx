import { useState } from 'react'

import { useUpdateWeights } from '../hooks/useApi'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Icon } from './ui/Icon'
import styles from './WeightsPanel.module.css'

const ROWS = [
  { key: 'academic', label: 'Академічна (A) · w₁', color: 'var(--pine)' },
  { key: 'engagement', label: 'Залученість (B) · w₂', color: 'var(--clay)' },
  { key: 'time', label: 'Час (T) · w₃', color: 'var(--gold)' },
]

// Keep the three weights summing to 1: hold the edited one, redistribute
// the remainder across the other two in proportion to their current values.
function rebalance(weights, changedKey, raw) {
  const value = Math.min(0.9, Math.max(0, raw))
  const others = ROWS.map((r) => r.key).filter((k) => k !== changedKey)
  const remaining = 1 - value
  const otherSum = others.reduce((s, k) => s + weights[k], 0)
  const next = { ...weights, [changedKey]: value }
  if (otherSum === 0) {
    others.forEach((k) => (next[k] = remaining / others.length))
  } else {
    others.forEach((k) => (next[k] = (weights[k] / otherSum) * remaining))
  }
  return next
}

export function WeightsPanel({ course }) {
  const [weights, setWeights] = useState({
    academic: course.weight_academic,
    engagement: course.weight_engagement,
    time: course.weight_time,
  })
  const [threshold, setThreshold] = useState(course.pass_threshold)
  const [saved, setSaved] = useState(false)
  const mutation = useUpdateWeights(course.id)

  const sum = weights.academic + weights.engagement + weights.time

  function onSlide(key, raw) {
    setSaved(false)
    setWeights((w) => rebalance(w, key, raw))
  }

  function onSave() {
    // Normalize precisely so the sum equals 1 within the API tolerance.
    const total = sum || 1
    mutation.mutate(
      {
        weight_academic: weights.academic / total,
        weight_engagement: weights.engagement / total,
        weight_time: weights.time / total,
        pass_threshold: threshold,
      },
      { onSuccess: () => setSaved(true) },
    )
  }

  return (
    <Card padded raised>
      <p
        style={{
          fontSize: 'var(--text-xs)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--ink-faint)',
          marginBottom: 'var(--sp-5)',
        }}
      >
        Вагові коефіцієнти індексу
      </p>

      <div className={styles.panel}>
        {ROWS.map(({ key, label, color }) => (
          <div key={key} className={styles.row}>
            <div className={styles.rowHead}>
              <span style={{ color: 'var(--ink-soft)' }}>{label}</span>
              <b className="tnum">{weights[key].toFixed(2)}</b>
            </div>
            <input
              className={styles.range}
              style={{ '--accent': color }}
              type="range"
              min="0"
              max="0.9"
              step="0.05"
              value={weights[key]}
              onChange={(e) => onSlide(key, Number(e.target.value))}
            />
          </div>
        ))}

        <div className={styles.row}>
          <div className={styles.rowHead}>
            <span style={{ color: 'var(--ink-soft)' }}>
              Критичний поріг θ
            </span>
            <b className="tnum">{threshold.toFixed(2)}</b>
          </div>
          <input
            className={`${styles.range} ${styles.threshold}`}
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={threshold}
            onChange={(e) => {
              setSaved(false)
              setThreshold(Number(e.target.value))
            }}
          />
        </div>

        <div className={styles.sumRow}>
          <span>
            Σ ваг ={' '}
            <span className={`tnum ${styles.sumOk}`}>{sum.toFixed(2)}</span>
          </span>
          <span style={{ display: 'flex', gap: 'var(--sp-3)', alignItems: 'center' }}>
            {saved && (
              <span className={styles.saved}>
                <Icon name="check" size={14} /> Збережено
              </span>
            )}
            <Button
              size="sm"
              onClick={onSave}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Збереження…' : 'Зберегти'}
            </Button>
          </span>
        </div>
        {mutation.isError && (
          <p style={{ color: 'var(--risk)', fontSize: 'var(--text-sm)' }}>
            {mutation.error?.detail || 'Не вдалося зберегти'}
          </p>
        )}
      </div>
    </Card>
  )
}
