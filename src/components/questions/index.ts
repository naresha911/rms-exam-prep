export { logQuestionPresentation } from './debugLog';

export type {
    QuestionPresentation,
    QuestionUiMode,
    SelectionMode,
    OptionUiState,
    QuestionSolveStatus,
    FractionNode,
    EquationPayload,
    MatchingListItem,
    MatchingListsPayload,
    AssertionReasonPayload,
    QuestionPresentationHints,
    QuestionRenderItem,
    ComprehensionGroupData,
    ResolvePresentationOptions,
    QuestionContentFlags,
    QuestionCardShellProps,
    SharedQuestionProps,
} from './types';

export {
    resolvePresentation,
    resolveLeafForPreview,
    getContentFlags,
    getOptionValue,
    findCorrectOptionValue,
} from './resolvePresentation';

export { paperQuestionToRenderItem, testQuestionToRenderItem } from './adapters';
export type { MinimalTestQuestion } from './adapters';

export { deriveOptionState, shouldShowCorrectCheck } from './optionState';

export { QuestionCardShell } from './QuestionCardShell';
export { OptionGrid } from './OptionGrid';
export { OptionStack } from './OptionStack';
export { FigureOptionTile } from './FigureOptionTile';
export { StemText } from './StemText';
export { QuestionRenderer } from './QuestionRenderer';
export { QuestionAssist } from './QuestionAssist';
export { LatexText } from './LatexText';

export { McqTextGrid } from './variants/McqTextGrid';
export { McqTextStack } from './variants/McqTextStack';
export { McqEquation } from './variants/McqEquation';
export { McqInlineMath } from './variants/McqInlineMath';
export { McqDiagram } from './variants/McqDiagram';
export { AssertionReason } from './variants/AssertionReason';
export { FigureSeries } from './variants/FigureSeries';
export { MatchingLists } from './variants/MatchingLists';
export { ListPreview } from './variants/ListPreview';
export { ComprehensionGroup } from './variants/ComprehensionGroup';
