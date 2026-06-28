// Shared recommendation metadata + helpers, used by both the post-test
// pop-up card and the sidebar "what to do now" panel. Kept out of the
// component files so those can export only components (react-refresh).

export const STATUS = {
  CREATED: { tone: 'watch', label: 'Нова' },
  VIEWED: { tone: 'neutral', label: 'Переглянуто' },
  COMPLETED: { tone: 'pass', label: 'Виконано' },
}

// Per-template visual identity: a line-icon name + accent colour + label.
export const TYPE_META = {
  AT_RISK_ALERT: { icon: 'alertTriangle', color: 'var(--risk)', label: 'Зона ризику' },
  REVIEW_THEORY: { icon: 'bookOpen', color: 'var(--clay)', label: 'Повторення теорії' },
  ADDITIONAL_MATERIAL: { icon: 'plus', color: 'var(--clay)', label: 'Додатково' },
  RETRY_TEST: { icon: 'rotate', color: 'var(--watch)', label: 'Повторний тест' },
  PRACTICE_REMINDER: { icon: 'pencil', color: 'var(--watch)', label: 'Здати роботу' },
  REINFORCE_AFTER_PASS: { icon: 'check', color: 'var(--pass)', label: 'Закріплення' },
  NEXT_MODULE: { icon: 'arrowRight', color: 'var(--pine)', label: 'Наступний розділ' },
  STRONG_PROGRESS: { icon: 'star', color: 'var(--pass)', label: 'Чудово' },
  TOPIC_SEQUENCE: { icon: 'listOrdered', color: 'var(--pine)', label: 'Послідовність' },
  CERTIFICATE_PROGRESS: { icon: 'award', color: 'var(--gold)', label: 'Сертифікат' },
  LEARNING_TRAJECTORY: { icon: 'compass', color: 'var(--pine)', label: 'Траєкторія' },
  PACE_REGULARITY: { icon: 'clock', color: 'var(--gold)', label: 'Регулярність' },
}

export const DEFAULT_META = {
  icon: 'lightbulb',
  color: 'var(--pine)',
  label: 'Порада',
}

// The "act now" templates surfaced in the sidebar: failed-test reviews,
// work submissions and moving on to a new section - the moments that need
// a concrete next step, not the advisory/positive notes.
export const ACTIONABLE_TYPES = new Set([
  'AT_RISK_ALERT',
  'REVIEW_THEORY',
  'RETRY_TEST',
  'PRACTICE_REMINDER',
  'NEXT_MODULE',
  'ADDITIONAL_MATERIAL',
])

const LINK_LABEL = {
  REVIEW_THEORY: 'Відкрити теорію',
  ADDITIONAL_MATERIAL: 'Відкрити матеріал',
  NEXT_MODULE: 'До наступної теми',
  PRACTICE_REMINDER: 'Перейти до завдання',
  RETRY_TEST: 'Пройти тест знову',
  AT_RISK_ALERT: 'Відкрити розділ',
}

/**
 * Build the navigation target for a recommendation.
 * Links straight to the suggested material when one is attached (e.g. the
 * theory to review), otherwise to the owning course page.
 * Returns `null` when there is nothing to open.
 */
export function recLink(rec) {
  if (!rec.course_id) return null
  if (rec.material_id) {
    return {
      to: `/courses/${rec.course_id}/materials/${rec.material_id}`,
      label: LINK_LABEL[rec.recommendation_type] || 'Відкрити',
    }
  }
  return { to: `/courses/${rec.course_id}`, label: 'Перейти до курсу' }
}
