export class HashedDomElement {
  /**
   * Hash of the dom element to be used as a unique identifier
   */
  constructor(
    public branchPathHash: string,
    public attributesHash: string,
    public xpathHash: string,
    // textHash: string
  ) {}
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface CoordinateSet {
  topLeft: Coordinates;
  topRight: Coordinates;
  bottomLeft: Coordinates;
  bottomRight: Coordinates;
  center: Coordinates;
  width: number;
  height: number;
}

export interface ViewportInfo {
  scrollX: number;
  scrollY: number;
  width: number;
  height: number;
}

export class DOMHistoryElement {
  constructor(
    public tagName: string,
    public xpath: string,
    public highlightIndex: number | null,
    public entireParentBranchPath: string[],
    public attributes: Record<string, string>,
    public shadowRoot = false,
    public cssSelector: string | null = null,
    public pageCoordinates: CoordinateSet | null = null,
    public viewportCoordinates: CoordinateSet | null = null,
    public viewportInfo: ViewportInfo | null = null,
  ) {}

  toDict(): Record<string, any> {
    return {
      tagName: this.tagName,
      xpath: this.xpath,
      highlightIndex: this.highlightIndex,
      entireParentBranchPath: this.entireParentBranchPath,
      attributes: this.attributes,
      shadowRoot: this.shadowRoot,
      cssSelector: this.cssSelector,
      pageCoordinates: this.pageCoordinates,
      viewportCoordinates: this.viewportCoordinates,
      viewportInfo: this.viewportInfo,
    };
  }
}

// define the raw types used in pure javascript files that are injected into the page

export type RawDomTextNode = {
  type: string;
  text: string;
  isVisible: boolean;
};

export type RawDomElementNode = {
  // Element node doesn't have a type field
  tagName: string | null;
  xpath: string | null;
  attributes: Record<string, string>;
  children: string[]; // Array of node IDs
  isVisible?: boolean;
  isInteractive?: boolean;
  isTopElement?: boolean;
  isInViewport?: boolean;
  highlightIndex?: number;
  viewportCoordinates?: CoordinateSet;
  pageCoordinates?: CoordinateSet;
  viewportInfo?: ViewportInfo;
  shadowRoot?: boolean;
};

export type RawDomTreeNode = RawDomTextNode | RawDomElementNode;

export interface BuildDomTreeArgs {
  doHighlightElements: boolean;
  focusHighlightIndex: number;
  viewportExpansion: number;
  debugMode?: boolean;
}

export interface PerfMetrics {
  nodeMetrics: {
    totalNodes: number;
    processedNodes: number;
    skippedNodes: number;
  };
  cacheMetrics: {
    boundingRectCacheHits: number;
    boundingRectCacheMisses: number;
    computedStyleCacheHits: number;
    computedStyleCacheMisses: number;
    getBoundingClientRectTime: number;
    getComputedStyleTime: number;
    boundingRectHitRate: number;
    computedStyleHitRate: number;
    overallHitRate: number;
  };
  timings: Record<string, number>;
  buildDomTreeBreakdown: Record<string, number | Record<string, number>>;
}

export interface BuildDomTreeResult {
  rootId: string;
  map: Record<string, RawDomTreeNode>;
  perfMetrics?: PerfMetrics; // Only included when debugMode is true
}
