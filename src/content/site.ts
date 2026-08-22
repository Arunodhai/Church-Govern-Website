export type Module = {
  slug: string;
  name: string;
  suite: "Office suite" | "Member suite";
  eyebrow: string;
  summary: string;
  overview: string;
  benefits: string[];
  features: string[];
  workflow: string[];
  related: string[];
};

const officeModules: Module[] = [
  {
    slug: "church-dashboard",
    name: "Church Dashboard",
    suite: "Office suite",
    eyebrow: "A clear view of church life",
    summary: "Bring the day’s priorities, activity and ministry signals into one calm workspace.",
    overview: "The Church Dashboard gives authorized teams a shared starting point for daily administration. The final widgets and measures will be configured with each church during implementation.",
    benefits: ["See important activity at a glance", "Reduce time spent moving between records", "Help leaders act on timely information"],
    features: ["Role-aware overview", "Upcoming activity", "Pending request indicators", "Configurable quick actions"],
    workflow: ["Sign in securely", "Review the church overview", "Open an item that needs attention", "Complete the task in its source module"],
    related: ["family-management", "reports", "communication"],
  },
  {
    slug: "family-management",
    name: "Family Management",
    suite: "Office suite",
    eyebrow: "One connected family record",
    summary: "Organize household relationships, member details and pastoral context with care.",
    overview: "Family Management is designed to replace disconnected registers with searchable, permission-controlled family and member records.",
    benefits: ["Keep family relationships connected", "Find records without searching paper files", "Support more informed pastoral care"],
    features: ["Household profiles", "Member relationships", "Contact details", "Record history"],
    workflow: ["Create or locate a family", "Add or update members", "Record relevant details", "Use the record across authorized workflows"],
    related: ["record-management", "communication", "church-directory"],
  },
  {
    slug: "church-administration",
    name: "Church Administration",
    suite: "Office suite",
    eyebrow: "Daily work, brought together",
    summary: "Coordinate routine office activity through consistent, trackable processes.",
    overview: "Church Administration provides a structured place for recurring administrative work. Exact processes remain configurable to the church’s governance model.",
    benefits: ["Standardize recurring tasks", "Give teams clearer ownership", "Reduce duplicated administrative effort"],
    features: ["Operational task views", "Structured church records", "Permission-based access", "Activity history"],
    workflow: ["Choose an administrative process", "Enter or review the required information", "Assign or complete the work", "Retain a searchable history"],
    related: ["record-management", "request-certificate-processing", "asset-management"],
  },
  {
    slug: "record-management",
    name: "Record Management",
    suite: "Office suite",
    eyebrow: "Preserve every important record",
    summary: "Keep essential church information organized, searchable and protected.",
    overview: "Record Management centralizes records while helping authorized staff maintain consistent information. Retention rules and record types are defined during implementation.",
    benefits: ["Reduce dependence on physical registers", "Improve retrieval and continuity", "Protect access to sensitive information"],
    features: ["Structured record categories", "Search and filtering", "Access controls", "Change history"],
    workflow: ["Choose a record category", "Create or digitize the record", "Validate key details", "Retrieve it through secure search"],
    related: ["family-management", "request-certificate-processing", "reports"],
  },
  {
    slug: "request-certificate-processing",
    name: "Request & Certificate Processing",
    suite: "Office suite",
    eyebrow: "From request to completion",
    summary: "Guide service and certificate requests through a visible, consistent workflow.",
    overview: "This module helps church offices receive, review and complete member requests without losing context across calls, paper notes and inboxes.",
    benefits: ["Make request status easier to follow", "Reduce repeated data entry", "Create a consistent member experience"],
    features: ["Request intake", "Status tracking", "Document preparation workflow", "Completion history"],
    workflow: ["Receive a member request", "Verify the supporting record", "Prepare and review the output", "Mark complete and notify the requester"],
    related: ["request-submission", "record-management", "notifications"],
  },
  {
    slug: "finance-management",
    name: "Finance Management",
    suite: "Office suite",
    eyebrow: "Clearer stewardship workflows",
    summary: "Support accurate financial administration, donations and reporting.",
    overview: "Finance Management is intended to organize authorized church finance workflows. Financial controls, local accounting requirements and integrations require discovery before deployment.",
    benefits: ["Improve visibility for authorized leaders", "Create more consistent records", "Reduce manual reporting effort"],
    features: ["Income and expense records", "Donation tracking", "Permission controls", "Financial summaries"],
    workflow: ["Record an authorized transaction", "Classify it consistently", "Review supporting information", "Use summaries for reporting"],
    related: ["reports", "subscription-history", "church-dashboard"],
  },
  {
    slug: "communication",
    name: "Communication",
    suite: "Office suite",
    eyebrow: "Reach the right people",
    summary: "Coordinate timely church communication from trusted member information.",
    overview: "Communication helps authorized teams prepare targeted updates using the church’s current records. Delivery channels and consent rules will depend on implementation.",
    benefits: ["Keep updates consistent", "Use relevant audience groups", "Reduce disconnected contact lists"],
    features: ["Audience groups", "Message preparation", "Announcement history", "Consent-aware contact data"],
    workflow: ["Choose an audience", "Prepare the message", "Review and send through an enabled channel", "Retain a communication record"],
    related: ["notifications", "family-management", "church-directory"],
  },
  {
    slug: "asset-management",
    name: "Asset Management",
    suite: "Office suite",
    eyebrow: "Care for shared resources",
    summary: "Maintain a dependable register of church property and equipment.",
    overview: "Asset Management creates a structured inventory for church resources, ownership context and relevant maintenance information.",
    benefits: ["Know what the church is responsible for", "Keep asset details in one place", "Support maintenance planning"],
    features: ["Asset register", "Categories and locations", "Ownership details", "Maintenance notes"],
    workflow: ["Add an asset", "Assign its category and location", "Maintain relevant details", "Review the register when planning"],
    related: ["church-administration", "reports", "church-dashboard"],
  },
  {
    slug: "cemetery-management",
    name: "Cemetery Management",
    suite: "Office suite",
    eyebrow: "Respectful, durable records",
    summary: "Organize cemetery information and preserve records for future generations.",
    overview: "Cemetery Management supports structured burial and plot records with controlled access. Field definitions and mapping needs must be confirmed with each church.",
    benefits: ["Preserve historically important information", "Make records easier to locate", "Support consistent cemetery administration"],
    features: ["Burial records", "Plot references", "Searchable details", "Supporting notes"],
    workflow: ["Locate or create a plot reference", "Add the relevant record", "Review details for accuracy", "Retrieve it through authorized search"],
    related: ["record-management", "family-management", "reports"],
  },
  {
    slug: "reports",
    name: "Reports",
    suite: "Office suite",
    eyebrow: "Turn records into understanding",
    summary: "Give authorized leaders useful summaries without rebuilding spreadsheets.",
    overview: "Reports brings together information captured across enabled modules. Available reports and export formats will be confirmed during implementation.",
    benefits: ["Reduce repetitive reporting work", "Support informed decisions", "Use consistent source information"],
    features: ["Module-based summaries", "Filters", "Authorized exports", "Reusable report views"],
    workflow: ["Choose a report", "Apply the relevant filters", "Review the result", "Export only when authorized"],
    related: ["church-dashboard", "finance-management", "record-management"],
  },
];

const memberModules: Module[] = [
  {
    slug: "member-dashboard",
    name: "Member Dashboard",
    suite: "Member suite",
    eyebrow: "A simple personal starting point",
    summary: "Help members find updates, requests and profile information in one place.",
    overview: "The Member Dashboard is a secure self-service home for the member-facing capabilities enabled by a church.",
    benefits: ["Find relevant services quickly", "Stay connected to church activity", "Reduce routine office enquiries"],
    features: ["Personal overview", "Church updates", "Request status", "Quick links"],
    workflow: ["Sign in securely", "Review the personal overview", "Choose an available service", "Follow the guided next step"],
    related: ["notifications", "request-submission", "family-profile"],
  },
  {
    slug: "family-profile",
    name: "Family Profile",
    suite: "Member suite",
    eyebrow: "Keep family information current",
    summary: "Give members a guided view of approved household details.",
    overview: "Family Profile allows members to view and, where enabled, request updates to information connected to their household.",
    benefits: ["Improve record accuracy", "Make relevant details easier to access", "Create a clear update process"],
    features: ["Household overview", "Member details", "Contact information", "Update requests"],
    workflow: ["Open the family profile", "Review visible information", "Submit an allowed update", "Church staff reviews the change when required"],
    related: ["profile-management", "family-management", "member-dashboard"],
  },
  {
    slug: "request-submission",
    name: "Request Submission",
    suite: "Member suite",
    eyebrow: "Church services without uncertainty",
    summary: "Let members submit eligible requests and follow their progress online.",
    overview: "Request Submission creates a guided entry point for church services configured by the church office.",
    benefits: ["Reduce avoidable office visits", "Capture required details consistently", "Give members clearer progress visibility"],
    features: ["Service catalogue", "Guided request forms", "Supporting information", "Status view"],
    workflow: ["Choose an available service", "Provide the requested information", "Submit for church review", "Follow the status to completion"],
    related: ["request-certificate-processing", "notifications", "member-dashboard"],
  },
  {
    slug: "subscription-history",
    name: "Subscription History",
    suite: "Member suite",
    eyebrow: "A clear personal history",
    summary: "Help members review the subscription records made available by their church.",
    overview: "Subscription History presents member-visible subscription information in a consistent format. The exact definition of subscriptions requires product confirmation.",
    benefits: ["Give members convenient reference", "Reduce simple record enquiries", "Keep a consistent personal view"],
    features: ["History view", "Period filters", "Record details", "Member-only access"],
    workflow: ["Open subscription history", "Choose a period", "Review available records", "Contact the church if correction is needed"],
    related: ["finance-management", "member-dashboard", "notifications"],
  },
  {
    slug: "notifications",
    name: "Notifications",
    suite: "Member suite",
    eyebrow: "Timely updates, less noise",
    summary: "Keep members informed about requests, events and church communication.",
    overview: "Notifications brings member-relevant updates into one view. Supported delivery channels and preferences will depend on deployment.",
    benefits: ["Make important updates easier to notice", "Keep request communication connected", "Support timely engagement"],
    features: ["In-app updates", "Read status", "Request notifications", "Preference-ready architecture"],
    workflow: ["Receive a relevant update", "Open it for context", "Take action when requested", "Retain it for later reference"],
    related: ["communication", "request-submission", "member-dashboard"],
  },
  {
    slug: "church-directory",
    name: "Church Directory",
    suite: "Member suite",
    eyebrow: "Find approved connections",
    summary: "Offer a privacy-aware directory based on church permissions and member choices.",
    overview: "Church Directory can help members find approved people or groups while respecting visibility rules. Consent and field visibility must be configured before launch.",
    benefits: ["Support community connection", "Keep directory information current", "Respect member visibility choices"],
    features: ["Permission-aware listings", "Search", "Member-approved details", "Configurable visibility"],
    workflow: ["Open the directory", "Search an approved listing", "View permitted information", "Use the church’s enabled contact path"],
    related: ["family-management", "profile-management", "communication"],
  },
  {
    slug: "profile-management",
    name: "Profile Management",
    suite: "Member suite",
    eyebrow: "Personal details, responsibly managed",
    summary: "Help members maintain permitted profile and preference information.",
    overview: "Profile Management gives members control over the information and preferences their church has chosen to make self-service.",
    benefits: ["Improve information accuracy", "Make privacy choices clearer", "Reduce routine change requests"],
    features: ["Personal details", "Contact preferences", "Visibility controls", "Secure account settings"],
    workflow: ["Open profile settings", "Review editable details", "Save or request a change", "Confirm the updated information"],
    related: ["family-profile", "church-directory", "notifications"],
  },
];

export const modules = [...officeModules, ...memberModules];
export const officeSuite = officeModules;
export const memberSuite = memberModules;

export type BlogPost = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  popular?: boolean;
  sections: { heading: string; paragraphs: string[] }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "building-a-responsible-digitization-plan",
    title: "Building a responsible digitization plan for church records",
    summary: "A practical starting point for deciding what to digitize, how to prioritize, and where safeguards belong.",
    category: "Digital transformation",
    date: "2026-07-28",
    readTime: "6 min read",
    author: "Church Govern editorial team",
    popular: true,
    sections: [
      { heading: "Begin with purpose", paragraphs: ["Digitization is most useful when it answers a clear operational or pastoral need. Start by identifying the records people struggle to locate, the processes that create repeated work, and the information that is most vulnerable to loss."] },
      { heading: "Prioritize with care", paragraphs: ["A simple inventory can group records by condition, frequency of use, sensitivity and long-term value. This helps a church plan manageable phases instead of attempting a risky one-time migration."] },
      { heading: "Protect context as well as documents", paragraphs: ["Scanning a page is only one part of preservation. Consistent names, dates, categories, permissions and review steps make the resulting information dependable and easier to find."] },
    ],
  },
  {
    slug: "less-administration-more-ministry",
    title: "Less administration, more time for ministry",
    summary: "Where connected workflows can reduce repetitive work for clergy and church office teams.",
    category: "Church administration",
    date: "2026-07-12",
    readTime: "5 min read",
    author: "Church Govern editorial team",
    popular: true,
    sections: [
      { heading: "Look for repeated handoffs", paragraphs: ["Administrative friction often hides in small handoffs: a request copied from a message into a register, a member asked for details the church already holds, or a report rebuilt from several files."] },
      { heading: "Create one dependable path", paragraphs: ["A connected workflow gives each request a clear entry point, owner and status. The goal is not to remove human care, but to protect more time for it."] },
      { heading: "Measure what improves", paragraphs: ["Track fewer missing details, shorter response time and reduced duplicate entry. These practical signals are often more useful than counting how many features have been enabled."] },
    ],
  },
  {
    slug: "privacy-by-design-for-church-data",
    title: "Privacy by design for sensitive church information",
    summary: "Seven questions to ask before introducing a new digital process or member service.",
    category: "Governance",
    date: "2026-06-24",
    readTime: "7 min read",
    author: "Church Govern editorial team",
    popular: true,
    sections: [
      { heading: "Collect with a reason", paragraphs: ["Teams should be able to explain why each field is needed, who can see it, how long it is kept and how a person can ask for a correction."] },
      { heading: "Make access deliberate", paragraphs: ["Role-based access works best when permissions reflect real responsibilities and are reviewed when responsibilities change."] },
      { heading: "Plan for the full lifecycle", paragraphs: ["Privacy considerations continue after collection. Storage, exports, backups, corrections, deletion requests and incident response all need accountable processes."] },
    ],
  },
  {
    slug: "a-healthier-member-record",
    title: "What makes a healthier member record?",
    summary: "A simple framework for accurate, useful and respectfully maintained member information.",
    category: "Record management",
    date: "2026-06-02",
    readTime: "4 min read",
    author: "Church Govern editorial team",
    sections: [
      { heading: "Useful, not excessive", paragraphs: ["A healthy record contains information that supports a defined church purpose. More fields do not automatically create better understanding."] },
      { heading: "Current and accountable", paragraphs: ["Give members and authorized staff clear ways to identify outdated information and request corrections, with review where the information is sensitive."] },
      { heading: "Connected to action", paragraphs: ["Well-maintained records reduce repeated questions, improve communication and support pastoral follow-up without replacing personal judgment."] },
    ],
  },
  {
    slug: "clearer-church-finance-workflows",
    title: "Designing clearer church finance workflows",
    summary: "How consistency, permissions and review points can strengthen everyday stewardship.",
    category: "Church finance",
    date: "2026-05-19",
    readTime: "6 min read",
    author: "Church Govern editorial team",
    popular: true,
    sections: [
      { heading: "Define the path", paragraphs: ["Clear finance workflows specify who records, who reviews and what supporting information is required for each type of transaction."] },
      { heading: "Separate responsibilities", paragraphs: ["Permission design should reflect the church’s governance and review model. No software feature replaces appropriate oversight."] },
      { heading: "Report from consistent records", paragraphs: ["When records use shared categories and review steps, periodic summaries become easier to prepare and explain."] },
    ],
  },
  {
    slug: "choosing-technology-that-serves-community",
    title: "Choosing technology that serves community",
    summary: "A church-focused checklist for evaluating usability, continuity, privacy and support.",
    category: "Church technology",
    date: "2026-04-30",
    readTime: "5 min read",
    author: "Church Govern editorial team",
    sections: [
      { heading: "Start with people", paragraphs: ["Consider the confidence, devices and working conditions of the people who will use the system. A technically complete tool can still fail if everyday tasks are difficult to understand."] },
      { heading: "Ask about continuity", paragraphs: ["Clarify data ownership, exports, backups, support, onboarding and what happens when responsibilities change."] },
      { heading: "Evaluate with real work", paragraphs: ["A useful demonstration should follow common church tasks with representative information and enough time for the people responsible to ask questions."] },
    ],
  },
];

export const faqCategories = ["Product", "Pricing", "Security", "Digitization", "Deployment", "Support", "Implementation"] as const;

export const faqs = [
  { category: "Product", question: "What is Church Govern?", answer: "Church Govern is a church administration and member-engagement platform intended to bring records, everyday workflows and communication into one secure digital environment." },
  { category: "Product", question: "Is it suitable for every denomination?", answer: "The product is being designed as denomination-neutral. A church’s structure, terminology and enabled workflows would be confirmed during discovery and implementation." },
  { category: "Pricing", question: "How much does Church Govern cost?", answer: "Pricing has not yet been published. It will depend on the implementation scope, enabled modules and service requirements. Request a consultation for a documented proposal." },
  { category: "Security", question: "Who can access church information?", answer: "Access is intended to be role-based so people see only what their responsibilities require. Final permission roles and governance rules must be configured with each church." },
  { category: "Security", question: "Is Church Govern DPDP and GDPR compliant?", answer: "The platform is designed to support privacy-conscious implementation, but compliance depends on configuration, contracts and the church’s own processes. Formal legal and compliance documentation will be provided before production onboarding." },
  { category: "Digitization", question: "Can you help digitize old registers?", answer: "Church Govern is planning a digitization enquiry service for historical and current records. Record condition, volume, page size, location and handling requirements must be assessed before a proposal is confirmed." },
  { category: "Deployment", question: "Where is the platform hosted?", answer: "The final hosting architecture and data-region options are awaiting approved product documentation. These details should be confirmed as part of a security and deployment review." },
  { category: "Support", question: "What support is available?", answer: "The support model, service hours and response targets will be documented in the implementation proposal. This website does not yet make an unsupported service-level claim." },
  { category: "Implementation", question: "How does implementation begin?", answer: "Implementation begins with discovery: church structure, records, roles, workflows, integrations, migration needs and success criteria. A phased plan can then be agreed before configuration starts." },
  { category: "Implementation", question: "Can we begin with only a few modules?", answer: "A phased rollout is expected to be possible, subject to final product and commercial confirmation. The discovery process identifies useful starting workflows and dependencies." },
];

export const navItems = [
  { href: "/about", label: "About" },
  { href: "/product", label: "Product" },
  { href: "/security-compliance", label: "Trust" },
  { href: "/blogs", label: "Insights" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];
