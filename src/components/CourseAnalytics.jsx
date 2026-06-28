import { useCourseDifficulty, useCourseHeatmap } from '../hooks/useApi'
import { Spinner } from './ui/Spinner'
import styles from './CourseAnalytics.module.css'

const DIFF_LABEL = { easy: 'Легко', moderate: 'Помірно', hard: 'Складно' }

// Map an index value (0..1) to a red→amber→green pastel for the heatmap.
function heatStyle(value) {
  if (value == null) return undefined
  const hue = Math.round(Math.max(0, Math.min(1, value)) * 120)
  return { background: `hsl(${hue} 60% 80%)` }
}

export function CourseAnalytics({ courseId }) {
  const difficulty = useCourseDifficulty(courseId)
  const heatmap = useCourseHeatmap(courseId)

  return (
    <div className={styles.wrap}>
      <section>
        <p className={styles.label}>Аналіз складності матеріалів</p>
        {difficulty.isLoading ? (
          <Spinner label="…" />
        ) : (
          (difficulty.data || []).map((d) => (
            <div
              key={d.module_id}
              className={`${styles.diffRow} ${d.flagged ? styles.flagged : ''}`}
            >
              <span className={styles.diffName}>{d.title}</span>
              <span className={`${styles.pill} ${styles[d.difficulty]}`}>
                {DIFF_LABEL[d.difficulty] || d.difficulty}
              </span>
              <span className={styles.diffMeta}>
                індекс {d.avg_index.toFixed(2)}
              </span>
              <span className={styles.diffMeta}>
                ризик {Math.round(d.at_risk_ratio * 100)}% · {d.students} студ.
              </span>
              {d.flagged && d.hint && (
                <span className={styles.diffHint}>⚑ {d.hint}</span>
              )}
            </div>
          ))
        )}
      </section>

      <section>
        <p className={styles.label}>
          Теплова карта успішності (студенти × теми)
        </p>
        {heatmap.isLoading ? (
          <Spinner label="…" />
        ) : !heatmap.data || heatmap.data.rows.length === 0 ? (
          <p style={{ color: 'var(--ink-soft)' }}>
            Немає даних для теплової карти.
          </p>
        ) : (
          <>
            <div className={styles.heatScroll}>
              <table className={styles.heat}>
                <thead>
                  <tr>
                    <th>Студент</th>
                    {heatmap.data.modules.map((m, i) => (
                      <th key={i} className={styles.modhead}>
                        {m}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heatmap.data.rows.map((row) => (
                    <tr key={row.student_id}>
                      <td className={styles.namecell}>{row.name}</td>
                      {row.cells.map((v, i) => (
                        <td key={i}>
                          <div
                            className={`${styles.cell} ${v == null ? styles.empty : ''}`}
                            style={heatStyle(v)}
                            title={v == null ? 'немає даних' : v.toFixed(2)}
                          >
                            {v == null ? '·' : v.toFixed(2)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.legend}>
              <span className={styles.swatch} style={{ background: 'hsl(0 60% 80%)' }} />
              низький
              <span className={styles.swatch} style={{ background: 'hsl(60 60% 80%)' }} />
              середній
              <span className={styles.swatch} style={{ background: 'hsl(120 60% 80%)' }} />
              високий
            </div>
          </>
        )}
      </section>
    </div>
  )
}
