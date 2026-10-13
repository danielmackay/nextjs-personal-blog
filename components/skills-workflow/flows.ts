// Content for SkillsWorkflowWizard, ported from mattpocock/skills plugin v1.3.1 (commit 49dd158).
// Strings may wrap `inline code` in backticks; the wizard renders those as <code>.

export type FlowId = 'tiny' | 'small' | 'multi' | 'parallel' | 'huge'

export type NodeId =
  | 'wayfinder'
  | 'grill'
  | 'prototype'
  | 'to-spec'
  | 'to-tickets'
  | 'impl-here'
  | 'impl-ticket'
  | 'implement-spec'
  | 'tdd'
  | 'code-review'
  | 'pr'

// on = you type it, auto = runs inside another step, opt = optional on this path.
// Nodes missing from a flow's map are not used on that path.
export type NodeState = 'on' | 'auto' | 'opt'

export interface MapEntry {
  state: NodeState
  /** Overrides the default tag shown on the node, e.g. "agent applies" */
  tag?: string
}

export interface Stage {
  label: string
  nodes: { id: NodeId; name: string; sub: string }[]
}

export type SequenceItem =
  | { kind: 'step'; cmd: string; what: string; optional?: boolean; auto?: boolean }
  | { kind: 'hop'; move: string; note?: string }

export interface Flow {
  id: FlowId
  name: string
  pick: string
  title: string
  when: string
  /** Slug of the matching heading in the blog post, so the result can link to the long-form write-up */
  anchor: string
  map: Partial<Record<NodeId, MapEntry>>
  sequence: SequenceItem[]
  trap: { lead: string; body: string }
}

export type QuestionId = 'decided' | 'fits' | 'visible' | 'graph'

export type Next = { flow: FlowId } | { question: QuestionId }

export interface Question {
  id: QuestionId
  prompt: string
  help: string
  yes: Next
  no: Next
}

export const DEFAULT_TAGS: Record<NodeState, string> = {
  on: 'you type',
  auto: 'runs inside',
  opt: 'optional',
}

export const STAGES: Stage[] = [
  {
    label: 'Chart fog',
    nodes: [{ id: 'wayfinder', name: '/wayfinder', sub: 'map of decision tickets' }],
  },
  {
    label: 'Align',
    nodes: [
      { id: 'grill', name: '/grill-with-docs', sub: 'interview + glossary/ADRs' },
      { id: 'prototype', name: '/prototype', sub: 'detour via /handoff' },
    ],
  },
  { label: 'Record', nodes: [{ id: 'to-spec', name: '/to-spec', sub: 'decisions → spec issue' }] },
  {
    label: 'Slice',
    nodes: [{ id: 'to-tickets', name: '/to-tickets', sub: 'tracer-bullet tickets' }],
  },
  {
    label: 'Build',
    nodes: [
      { id: 'impl-here', name: '/implement', sub: 'same window' },
      { id: 'impl-ticket', name: '/implement #N', sub: 'one ticket per session' },
      { id: 'implement-spec', name: '/implement-spec', sub: 'parallel subagents' },
    ],
  },
  { label: 'Test-first', nodes: [{ id: 'tdd', name: '/tdd', sub: 'red → green at agreed seams' }] },
  {
    label: 'Review',
    nodes: [{ id: 'code-review', name: '/code-review', sub: 'Standards + Spec' }],
  },
  { label: 'Ship', nodes: [{ id: 'pr', name: '/pr', sub: 'PR body shape' }] },
]

export const FIRST_QUESTION: QuestionId = 'decided'

export const QUESTIONS: Record<QuestionId, Question> = {
  decided: {
    id: 'decided',
    prompt: "Is this one concrete behaviour that's already decided?",
    help: 'A validation rule, a transformation, a contract tweak. Defined inputs, an observable output, and nothing left to design.',
    yes: { flow: 'tiny' },
    no: { question: 'fits' },
  },
  fits: {
    id: 'fits',
    prompt: 'Will the planning and the build both fit in one context window?',
    help: 'Roughly 150k tokens, the "smart zone" where the model still reasons sharply. Think one sitting: grill out the decisions, then build, without clearing in between.',
    yes: { flow: 'small' },
    no: { question: 'visible' },
  },
  visible: {
    id: 'visible',
    prompt: 'Can you see the way to the end yet?',
    help: 'Could you grill out every decision in one session and turn it into a spec? If the destination is still fuzzy, or the planning alone would overflow a window, answer no.',
    yes: { question: 'graph' },
    no: { flow: 'huge' },
  },
  graph: {
    id: 'graph',
    prompt:
      'Do the tickets form a real graph, and would you rather orchestrate than drive each one?',
    help: 'Think five or more tickets with blocking edges between them, where several could be built at the same time.',
    yes: { flow: 'parallel' },
    no: { flow: 'multi' },
  },
}

export const FLOWS: Flow[] = [
  {
    id: 'tiny',
    name: 'Tiny',
    pick: 'One concrete behaviour, already decided',
    title: 'One behaviour, test-first',
    when: 'A single behaviour with defined inputs and an observable output. Nothing needs designing, so a spec and tickets would cost you more than they save.',
    anchor: 'tiny-one-behaviour-test-first',
    map: {
      grill: { state: 'opt' },
      tdd: { state: 'on' },
      'code-review': { state: 'on' },
      pr: { state: 'auto', tag: 'agent applies' },
    },
    sequence: [
      {
        kind: 'step',
        cmd: '/grill-with-docs',
        what: 'Only if something is still undecided',
        optional: true,
      },
      { kind: 'hop', move: 'continue' },
      {
        kind: 'step',
        cmd: '/tdd',
        what: 'Confirms the seams with you, then one red → green slice at a time',
      },
      { kind: 'hop', move: 'continue' },
      {
        kind: 'step',
        cmd: '/code-review main',
        what: 'Standards + Spec in parallel. With no spec, the Spec axis reports "no spec available"',
      },
      { kind: 'hop', move: 'continue' },
      {
        kind: 'step',
        cmd: 'open a PR',
        what: 'The agent writes the body in `/pr` shape',
        auto: true,
      },
    ],
    trap: {
      lead: 'Not everything is worth the loop.',
      body: "For config, wiring, glue or straight CRUD there's no independent source of truth to assert against, so `/tdd` tends to produce tautological tests. That call is yours, not the skill's.",
    },
  },
  {
    id: 'small',
    name: 'Fits one session',
    pick: 'A small feature you can grill and build in one window',
    title: 'Grill, then build in the same window',
    when: 'Some decisions are still open, but planning and building together fit in one context window. Skip the spec and go straight from grilling to `/implement`.',
    anchor: 'fits-one-session-grill-then-build',
    map: {
      grill: { state: 'on' },
      prototype: { state: 'opt' },
      'impl-here': { state: 'on' },
      tdd: { state: 'auto' },
      'code-review': { state: 'auto' },
      pr: { state: 'auto', tag: 'agent applies' },
    },
    sequence: [
      {
        kind: 'step',
        cmd: '/grill-with-docs',
        what: 'Rounds of numbered questions until the design tree is empty',
      },
      { kind: 'hop', move: 'continue', note: 'the build wants the reasoning verbatim' },
      {
        kind: 'step',
        cmd: '/implement',
        what: 'Say "the plan is in this conversation". Drives `/tdd`, runs `/code-review`, then commits',
      },
      { kind: 'hop', move: 'continue' },
      { kind: 'step', cmd: 'open a PR', what: 'Body in `/pr` shape', auto: true },
    ],
    trap: {
      lead: 'Don\'t add `/to-spec` "for safety".',
      body: "On single-session work it's an extra synthesis step where the model can drift. The spec exists because context windows end, and here this one doesn't.",
    },
  },
  {
    id: 'multi',
    name: 'Multi-session',
    pick: 'Decided build that spans several sessions; you drive each ticket',
    title: 'The main flow: spec, tickets, one ticket per session',
    when: "The build won't fit in one context window. The spec keeps the reasoning after the grilling session is cleared, and each ticket is sized for one fresh window.",
    anchor: 'multi-session-the-main-flow',
    map: {
      grill: { state: 'on' },
      prototype: { state: 'opt' },
      'to-spec': { state: 'on' },
      'to-tickets': { state: 'on' },
      'impl-ticket': { state: 'on' },
      tdd: { state: 'auto' },
      'code-review': { state: 'auto' },
      pr: { state: 'auto', tag: 'agent applies' },
    },
    sequence: [
      { kind: 'step', cmd: '/grill-with-docs', what: 'Shared understanding + vocabulary' },
      { kind: 'hop', move: 'continue', note: 'one unbroken window' },
      {
        kind: 'step',
        cmd: '/to-spec',
        what: 'No interview. Agrees test seams with you, publishes the spec',
      },
      { kind: 'hop', move: 'continue', note: "don't clear or compact here" },
      {
        kind: 'step',
        cmd: '/to-tickets',
        what: 'Vertical slices with blocking edges; you approve the breakdown',
      },
      { kind: 'hop', move: '/clear' },
      {
        kind: 'step',
        cmd: '/implement #N',
        what: 'One frontier ticket (blockers done). Drives `/tdd` + `/code-review`, commits',
      },
      { kind: 'hop', move: '/clear', note: 'then the next frontier ticket ↺' },
      { kind: 'step', cmd: 'open the PR', what: 'Body in `/pr` shape', auto: true },
    ],
    trap: {
      lead: 'The spec issue gets `ready-for-agent`,',
      body: 'which means "complete enough to work from", not "build this". AFK agents polling that label will try to build the whole spec at once. Exclude the parent spec in their prompt, or remove the label after `/to-tickets`.',
    },
  },
  {
    id: 'parallel',
    name: 'Multi-session, parallel',
    pick: "Same, but you'd rather orchestrate a fleet than drive each ticket",
    title: 'Spec and tickets, built as a task graph',
    when: 'Same planning as the main flow. Then one `/implement-spec` run builds the whole spec, with subagents working every ready ticket in parallel.',
    anchor: 'multi-session-parallel-build-a-task-graph',
    map: {
      grill: { state: 'on' },
      prototype: { state: 'opt' },
      'to-spec': { state: 'on' },
      'to-tickets': { state: 'on' },
      'implement-spec': { state: 'on' },
      tdd: { state: 'auto', tag: 'in each subagent' },
      'code-review': { state: 'auto', tag: 'once, at the end' },
      pr: { state: 'auto', tag: 'draft → ready' },
    },
    sequence: [
      { kind: 'step', cmd: '/grill-with-docs', what: 'Shared understanding + vocabulary' },
      { kind: 'hop', move: 'continue' },
      {
        kind: 'step',
        cmd: '/to-spec',
        what: 'Seams agreed here are the ones the implementers test at',
      },
      { kind: 'hop', move: 'continue' },
      { kind: 'step', cmd: '/to-tickets', what: 'Blocking edges become the task graph' },
      { kind: 'hop', move: '/clear' },
      {
        kind: 'step',
        cmd: '/implement-spec',
        what: 'Integration branch, one worktree per ready ticket, a merger subagent, one `/code-review`, fixes',
      },
    ],
    trap: {
      lead: 'Not for small work.',
      body: "With no real graph, plain `/implement` is simpler. Don't fake parallelism by running several `/implement` sessions in one checkout either; that's what `/implement-spec`'s per-ticket worktrees are for.",
    },
  },
  {
    id: 'huge',
    name: 'Huge & foggy',
    pick: 'Greenfield or huge feature; too big to plan in one session',
    title: 'Wayfinder first, then join the main flow at /to-spec',
    when: "The way to the destination isn't visible yet, and even the planning won't fit in one session. `/wayfinder` charts a map of decision tickets and resolves them one per session. When the map clears, it hands off and does not build.",
    anchor: 'huge-and-foggy-wayfinder-first',
    map: {
      wayfinder: { state: 'on' },
      grill: { state: 'auto', tag: 'grilling tickets' },
      prototype: { state: 'auto', tag: 'prototype tickets' },
      'to-spec': { state: 'on', tag: 'point it at the map' },
      'to-tickets': { state: 'on' },
      'impl-ticket': { state: 'on' },
      'implement-spec': { state: 'opt', tag: 'or this' },
      tdd: { state: 'auto' },
      'code-review': { state: 'auto' },
      pr: { state: 'auto', tag: 'agent applies' },
    },
    sequence: [
      {
        kind: 'step',
        cmd: '/wayfinder <loose idea>',
        what: 'Name the destination, grill breadth-first, create the map + tickets, fire research subagents',
      },
      { kind: 'hop', move: '/clear', note: 'charting resolves nothing else' },
      {
        kind: 'step',
        cmd: '/wayfinder <map>',
        what: 'Claim one frontier ticket, resolve it by type, record it, add new tickets as the fog clears',
      },
      { kind: 'hop', move: '/clear', note: 'then the next ticket ↺ (one per session)' },
      {
        kind: 'step',
        cmd: '/to-spec #<map>',
        what: 'Collapses the linked decisions into one buildable spec',
      },
      { kind: 'hop', move: 'continue' },
      { kind: 'step', cmd: '/to-tickets', what: 'Implementation slices' },
      { kind: 'hop', move: '/clear' },
      {
        kind: 'step',
        cmd: '/implement #N  or  /implement-spec',
        what: 'As in the multi-session flows',
      },
    ],
    trap: {
      lead: 'The common mistake is using wayfinder on a well-scoped feature.',
      body: "It's slower and denser than grilling. If the opening grill finds no fog, it stops and tells you a map isn't needed. Scope the map to one epic, not the whole product, or later tickets rest on assumptions earlier ones overturn.",
    },
  },
]
