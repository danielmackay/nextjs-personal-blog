'use client'

import { Fragment, useEffect, useRef, useState, type RefObject } from 'react'
import {
  DEFAULT_TAGS,
  FIRST_QUESTION,
  FLOWS,
  QUESTIONS,
  STAGES,
  type Flow,
  type FlowId,
  type MapEntry,
  type NodeState,
  type Question,
  type SequenceItem,
} from './flows'

type Mode = { kind: 'wizard'; answers: boolean[] } | { kind: 'jump'; flow: FlowId }

interface Answered {
  question: Question
  answer: boolean
}

type Position = { kind: 'question'; question: Question } | { kind: 'result'; flow: Flow }

const FLOW_BY_ID = new Map<FlowId, Flow>(FLOWS.map((f) => [f.id, f]))

function getFlow(id: FlowId): Flow {
  const flow = FLOW_BY_ID.get(id)
  // Only reachable if flows.ts references an id it never defines, which is an authoring bug
  if (!flow) throw new Error(`SkillsWorkflowWizard: no flow defined for "${id}"`)
  return flow
}

// Replays the answers through the decision tree. Answers are stored rather than the current
// node so "Change" on an earlier question can truncate the trail and everything after it.
function walk(answers: boolean[]): { trail: Answered[]; position: Position } {
  const trail: Answered[] = []
  let question = QUESTIONS[FIRST_QUESTION]
  for (const answer of answers) {
    trail.push({ question, answer })
    const next = answer ? question.yes : question.no
    if ('flow' in next) return { trail, position: { kind: 'result', flow: getFlow(next.flow) } }
    question = QUESTIONS[next.question]
  }
  return { trail, position: { kind: 'question', question } }
}

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500'

const codeClass =
  'rounded bg-pink-50 px-1 py-0.5 font-mono text-[0.88em] text-pink-700 [overflow-wrap:anywhere] dark:bg-pink-950/40 dark:text-pink-300'

/** Renders `backtick` spans from the flow data as inline code */
function Inline({ text }: { text: string }) {
  const parts = text.split('`')
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className={codeClass}>
            {part}
          </code>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  )
}

const nodeStateClass: Record<NodeState | 'off', string> = {
  on: 'border-primary-700 bg-primary-700 text-white dark:border-primary-600 dark:bg-primary-700',
  auto: 'border-primary-700 bg-primary-50 text-primary-900 dark:border-primary-500 dark:bg-primary-950 dark:text-primary-100',
  opt: 'border-dashed border-primary-600 bg-white text-gray-900 dark:border-primary-400 dark:bg-gray-950 dark:text-gray-100',
  off: 'border-dashed border-gray-300 text-gray-500 dark:border-gray-700 dark:text-gray-400',
}

function SkillMap({ flow }: { flow: Flow }) {
  return (
    <div>
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-1 dark:border-gray-700 dark:bg-gray-950">
        {STAGES.map((stage) => (
          <div
            key={stage.label}
            className="grid grid-cols-1 gap-1.5 border-b border-dashed border-gray-200 py-2.5 last:border-b-0 dark:border-gray-700 sm:grid-cols-[96px_minmax(0,1fr)] sm:items-center sm:gap-3"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
              {stage.label}
            </div>
            <div className="flex min-w-0 flex-wrap gap-2">
              {stage.nodes.map((node) => {
                const entry: MapEntry | undefined = flow.map[node.id]
                const state = entry?.state ?? 'off'
                const tag = entry ? (entry.tag ?? DEFAULT_TAGS[entry.state]) : null
                return (
                  <span
                    key={node.id}
                    className={`inline-flex min-w-0 max-w-full flex-col rounded-lg border-2 px-2.5 py-1.5 ${nodeStateClass[state]}`}
                  >
                    {tag && (
                      <span className="text-[11px] font-bold uppercase tracking-wide">{tag}</span>
                    )}
                    <span className="font-mono text-sm [overflow-wrap:anywhere]">{node.name}</span>
                    <span className="text-xs leading-snug">{node.sub}</span>
                  </span>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <ul
        className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-gray-600 dark:text-gray-400"
        aria-label="Legend"
      >
        <LegendItem state="on" label="You type it" />
        <LegendItem state="auto" label="Runs inside another step" />
        <LegendItem state="opt" label="Optional on this path" />
        <LegendItem state="off" label="Not used" />
      </ul>
    </div>
  )
}

function LegendItem({ state, label }: { state: NodeState | 'off'; label: string }) {
  return (
    <li className="flex items-center gap-1.5">
      <span
        aria-hidden="true"
        className={`inline-block h-3.5 w-5 rounded border-2 ${nodeStateClass[state]}`}
      />
      {label}
    </li>
  )
}

function Sequence({ items }: { items: SequenceItem[] }) {
  return (
    <ol className="my-4 flex flex-col">
      {items.map((item, i) =>
        item.kind === 'hop' ? (
          <li
            key={i}
            className="ml-3.5 border-l-2 border-gray-300 py-1 pl-4 text-[13px] text-gray-600 dark:border-gray-600 dark:text-gray-400"
          >
            <span aria-hidden="true">↓ </span>
            <span className="font-mono text-gray-900 dark:text-gray-100">{item.move}</span>
            {item.note && <span>, {item.note}</span>}
          </li>
        ) : (
          <li
            key={i}
            className={`rounded-lg border bg-white px-3 py-2 dark:bg-gray-950 ${
              item.optional
                ? 'border-dashed border-gray-400 dark:border-gray-500'
                : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <span className="font-mono text-sm font-medium text-gray-900 [overflow-wrap:anywhere] dark:text-gray-100">
              {item.cmd}
            </span>
            {(item.optional || item.auto) && (
              <span className="ml-2 text-[11px] font-bold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                {item.optional ? 'optional' : 'auto'}
              </span>
            )}
            <span className="block text-[13.5px] leading-snug text-gray-600 dark:text-gray-400">
              <Inline text={item.what} />
            </span>
          </li>
        )
      )}
    </ol>
  )
}

function Result({
  flow,
  headingRef,
  onRestart,
  restartLabel,
}: {
  flow: Flow
  headingRef: RefObject<HTMLHeadingElement>
  onRestart: () => void
  restartLabel: string
}) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-primary-700 dark:text-primary-400">
        Your workflow: {flow.name}
      </div>
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="mt-1 text-2xl font-bold leading-tight tracking-tight text-gray-900 focus:outline-none dark:text-gray-100"
      >
        <Inline text={flow.title} />
      </h3>
      <p className="mt-2 text-gray-700 dark:text-gray-300">
        <Inline text={flow.when} />
      </p>

      <Sequence items={flow.sequence} />

      <div className="rounded-lg border border-orange-300 bg-orange-50 px-3 py-2.5 text-sm text-orange-950 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-100">
        <strong>
          <Inline text={flow.trap.lead} />
        </strong>{' '}
        <Inline text={flow.trap.body} />
      </div>

      <h4 className="mb-2 mt-6 text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
        Where it sits in the full pipeline
      </h4>
      <SkillMap flow={flow} />

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
        <a
          href={`#${flow.anchor}`}
          className={`font-semibold text-primary-700 underline-offset-2 hover:underline dark:text-primary-400 ${focusRing}`}
        >
          Read the full write-up ↓
        </a>
        <button
          type="button"
          onClick={onRestart}
          className={`rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-800 hover:border-primary-600 dark:border-gray-600 dark:text-gray-200 ${focusRing}`}
        >
          {restartLabel}
        </button>
      </div>
    </div>
  )
}

export default function SkillsWorkflowWizard() {
  const [mode, setMode] = useState<Mode>({ kind: 'wizard', answers: [] })
  const headingRef = useRef<HTMLHeadingElement>(null)
  // Focus only follows the reader's own clicks; moving focus on first render would scroll the page
  const interacted = useRef(false)

  useEffect(() => {
    if (interacted.current) headingRef.current?.focus()
  }, [mode])

  const update = (next: Mode) => {
    interacted.current = true
    setMode(next)
  }

  const answers = mode.kind === 'wizard' ? mode.answers : []
  const { trail, position } = walk(answers)
  const shownFlowId =
    mode.kind === 'jump' ? mode.flow : position.kind === 'result' ? position.flow.id : null

  return (
    <section
      aria-label="Workflow picker"
      className="not-prose my-8 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900 sm:p-6"
    >
      <div aria-live="polite">
        {mode.kind === 'jump' ? (
          <Result
            flow={getFlow(mode.flow)}
            headingRef={headingRef}
            onRestart={() => update({ kind: 'wizard', answers: [] })}
            restartLabel="Answer the questions instead"
          />
        ) : (
          <>
            {trail.length > 0 && (
              <ol className="mb-5 flex flex-col gap-1.5">
                {trail.map(({ question, answer }, i) => (
                  <li
                    key={question.id}
                    className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <span className="min-w-0">
                      <span className="font-semibold text-gray-500 dark:text-gray-400">
                        {i + 1}.{' '}
                      </span>
                      {question.prompt}{' '}
                      <span className="font-bold text-gray-900 dark:text-gray-100">
                        {answer ? 'Yes' : 'No'}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => update({ kind: 'wizard', answers: answers.slice(0, i) })}
                      className={`rounded text-sm font-semibold text-primary-700 hover:underline dark:text-primary-400 ${focusRing}`}
                      aria-label={`Change answer to: ${question.prompt}`}
                    >
                      Change
                    </button>
                  </li>
                ))}
              </ol>
            )}

            {position.kind === 'question' ? (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-primary-700 dark:text-primary-400">
                  Question {trail.length + 1}
                </div>
                <h3
                  ref={headingRef}
                  tabIndex={-1}
                  className="mt-1 text-xl font-bold leading-snug tracking-tight text-gray-900 focus:outline-none dark:text-gray-100 sm:text-2xl"
                >
                  {position.question.prompt}
                </h3>
                <p className="mt-2 text-gray-700 dark:text-gray-300">{position.question.help}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:max-w-sm">
                  {[true, false].map((value) => (
                    <button
                      key={String(value)}
                      type="button"
                      onClick={() => update({ kind: 'wizard', answers: [...answers, value] })}
                      className={`rounded-xl border-2 border-gray-300 bg-white px-4 py-2.5 text-base font-bold text-gray-900 hover:border-primary-600 hover:bg-primary-50 dark:border-gray-600 dark:bg-gray-950 dark:text-gray-100 dark:hover:border-primary-400 dark:hover:bg-primary-950 ${focusRing}`}
                    >
                      {value ? 'Yes' : 'No'}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <Result
                flow={position.flow}
                headingRef={headingRef}
                onRestart={() => update({ kind: 'wizard', answers: [] })}
                restartLabel="Start over"
              />
            )}
          </>
        )}
      </div>

      <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
          Already know the shape of the work? Jump straight to a workflow:
        </p>
        <div className="flex flex-wrap gap-2">
          {FLOWS.map((flow) => {
            const active = flow.id === shownFlowId
            return (
              <button
                key={flow.id}
                type="button"
                aria-pressed={active}
                title={flow.pick}
                onClick={() => update({ kind: 'jump', flow: flow.id })}
                className={`rounded-full border-2 px-3 py-1 text-sm font-semibold ${
                  active
                    ? 'border-primary-700 bg-primary-700 text-white dark:border-primary-600'
                    : 'border-gray-300 bg-white text-gray-800 hover:border-primary-600 dark:border-gray-600 dark:bg-gray-950 dark:text-gray-200 dark:hover:border-primary-400'
                } ${focusRing}`}
              >
                {flow.name}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
