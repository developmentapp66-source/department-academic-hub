import { StudentUser, Subject, NoteItem, QuestionPaperItem, LabManualItem, AnnouncementItem } from '../types';

export const DEMO_STUDENTS: StudentUser[] = [
  {
    usn: '1MS21CS042',
    name: 'Aditya Sharma',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    semester: 5,
    section: 'A',
    academicYear: '2024–2025',
    email: 'aditya.21cs042@msrit.edu'
  },
  {
    usn: '1MS22EC018',
    name: 'Priyanka Rao',
    department: 'Electronics & Communication Engineering',
    deptCode: 'ECE',
    semester: 4,
    section: 'B',
    academicYear: '2024–2025',
    email: 'priyanka.22ec018@msrit.edu'
  },
  {
    usn: '1MS23AI005',
    name: 'Rohan Nambiar',
    department: 'Artificial Intelligence & Data Science',
    deptCode: 'AI&DS',
    semester: 3,
    section: 'A',
    academicYear: '2024–2025',
    email: 'rohan.23ai005@msrit.edu'
  }
];

export const SUBJECTS_LIST: Subject[] = [
  // 5th Sem CSE
  { code: '21CS51', name: 'Management, Entrepreneurship & IPR', semester: 5, credits: 3, faculty: 'Dr. Suresh Babu', category: 'Core' },
  { code: '21CS52', name: 'Computer Networks & Security', semester: 5, credits: 4, faculty: 'Prof. K. Venkatesh', category: 'Core' },
  { code: '21CS53', name: 'Database Management Systems', semester: 5, credits: 4, faculty: 'Dr. Anita Deshmukh', category: 'Core' },
  { code: '21CS54', name: 'Automata Theory & Computability', semester: 5, credits: 3, faculty: 'Dr. Rajeshwari K.', category: 'Core' },
  { code: '21CS55', name: 'Software Engineering & Agile', semester: 5, credits: 3, faculty: 'Prof. S. R. Hegde', category: 'Core' },
  { code: '21CSL56', name: 'Database Applications & Web Lab', semester: 5, credits: 2, faculty: 'Dr. Anita Deshmukh', category: 'Laboratory' },
  { code: '21CSL57', name: 'Computer Networks Lab', semester: 5, credits: 2, faculty: 'Prof. K. Venkatesh', category: 'Laboratory' },

  // 4th Sem CSE / ECE
  { code: '21CS41', name: 'Design & Analysis of Algorithms', semester: 4, credits: 4, faculty: 'Prof. P. R. Murthy', category: 'Core' },
  { code: '21CS42', name: 'Operating Systems', semester: 4, credits: 3, faculty: 'Dr. Sneha Patil', category: 'Core' },
  { code: '21CS43', name: 'Microcontroller & Embedded Systems', semester: 4, credits: 3, faculty: 'Prof. N. Swaminathan', category: 'Core' },
  { code: '21CSL46', name: 'Algorithms Laboratory', semester: 4, credits: 2, faculty: 'Prof. P. R. Murthy', category: 'Laboratory' },

  // 3rd Sem CSE / AI
  { code: '21CS31', name: 'Transform Calculus & Numerical Tech', semester: 3, credits: 3, faculty: 'Dr. G. Ramanathan', category: 'Core' },
  { code: '21CS32', name: 'Data Structures and Applications', semester: 3, credits: 4, faculty: 'Prof. Ananya Sen', category: 'Core' },
  { code: '21CS33', name: 'Analog and Digital Electronics', semester: 3, credits: 3, faculty: 'Dr. R. Balaji', category: 'Core' },
  { code: '21CSL36', name: 'Data Structures Laboratory', semester: 3, credits: 2, faculty: 'Prof. Ananya Sen', category: 'Laboratory' },

  // 6th Sem CSE
  { code: '21CS61', name: 'Machine Learning Techniques', semester: 6, credits: 4, faculty: 'Dr. Kavitha Menon', category: 'Core' },
  { code: '21CS62', name: 'Compiler Design', semester: 6, credits: 4, faculty: 'Prof. Harish Gowda', category: 'Core' },
  { code: '21CS63', name: 'Cloud Computing & Virtualization', semester: 6, credits: 3, faculty: 'Dr. M. S. Rao', category: 'Core' },
  { code: '21CSL66', name: 'Machine Learning Laboratory', semester: 6, credits: 2, faculty: 'Dr. Kavitha Menon', category: 'Laboratory' }
];

export const MOCK_NOTES: NoteItem[] = [
  {
    id: 'note-501',
    subjectCode: '21CS52',
    subjectName: 'Computer Networks & Security',
    semester: 5,
    unit: 1,
    unitTitle: 'Introduction & Application Layer Protocols',
    title: 'Network Core, Packet Switching, HTTP/2, DNS & Socket API',
    topics: ['Edge vs Core', 'Packet Switching vs Circuit Switching', 'Delay & Loss in Networks', 'HTTP 1.1 vs HTTP/2', 'DNS Hierarchy & Resolution', 'Socket Programming with TCP/UDP'],
    author: 'Prof. K. Venkatesh',
    dateUpdated: '2024-09-18',
    pages: 42,
    fileSize: '4.8 MB',
    summary: 'Comprehensive notes covering network edge/core architectures, queuing delays, transmission principles, socket architectures, and HTTP caching mechanics.',
    contentPreview: [
      '1. Overview of Internet Architecture: The Internet is a network of networks. End systems (hosts) connect to Edge routers via Access Networks (Fiber, Cable, DSL, 5G Wireless).',
      '2. Packet Switching vs Circuit Switching: Packet switching uses store-and-forward routing with statistical multiplexing, leading to queuing delay and potential packet drop. Circuit switching allocates dedicated TDM/FDM resources without queue delays but suffers from idle waste.',
      '3. Sources of Packet Delay: Total Nodal Delay = d_proc + d_queue + d_trans + d_prop. Where d_trans = L/R (L = packet length in bits, R = transmission rate in bps) and d_prop = d/s (d = distance, s = propagation speed ≈ 2×10^8 m/s).',
      '4. Domain Name System (DNS): Distributed hierarchical database comprised of Root DNS, Top-Level Domain (TLD) servers, Authoritative servers, and Local DNS caches. Employs both Recursive and Iterative query resolution.'
    ],
    keyDefinitions: [
      { term: 'Throughput', explanation: 'The rate (bits/time unit) at which bits are being transferred between a sender and receiver.' },
      { term: 'Propagation Delay', explanation: 'Time required for a single bit to travel from beginning of link to router interface (d / s).' },
      { term: 'Iterative DNS Resolution', explanation: 'The contacted server replies with the address of the next server in hierarchy for the client to contact directly.' }
    ],
    importantFormulasOrCode: [
      'Transmission Delay: d_trans = L / R',
      'Bandwidth-Delay Product: BDP = R × RTT (represents max bits in flight)',
      'Little\'s Law: Average Queuing Delay N = λ × W'
    ],
    downloadFileName: '21CS52_Unit1_AppLayer_Venkatesh.pdf'
  },
  {
    id: 'note-502',
    subjectCode: '21CS52',
    subjectName: 'Computer Networks & Security',
    semester: 5,
    unit: 2,
    unitTitle: 'Transport Layer & Congestion Control',
    title: 'TCP vs UDP, Reliable Data Transfer (rdt 3.0), Flow & Congestion Control',
    topics: ['Transport Layer Multiplexing', 'UDP Checksum Calculation', 'Go-Back-N vs Selective Repeat', 'TCP 3-Way Handshake & Teardown', 'TCP Reno vs Tahoe Congestion Control', 'AIMD & Fast Recovery'],
    author: 'Prof. K. Venkatesh',
    dateUpdated: '2024-10-02',
    pages: 58,
    fileSize: '5.2 MB',
    summary: 'Deep dive into end-to-end transport mechanics, sliding window calculations, AIMD state machines, fast retransmit heuristics, and buffer management.',
    contentPreview: [
      '1. Transport-Layer Services: Logical communication between application processes running on different hosts, distinct from network layer host-to-host service.',
      '2. Principles of Reliable Data Transfer: Progression from rdt 1.0 (reliable channel) to rdt 2.0 (bit errors + ACKs/NAKs), rdt 2.2 (ACK with sequence number), and rdt 3.0 (lossy channel with countdown timer).',
      '3. Pipelined Protocols: Go-Back-N (GBN) sender allows up to N unacknowledged packets; receiver discards out-of-order packets and sends cumulative ACK. Selective Repeat (SR) individual buffer acknowledges each packet.',
      '4. TCP Congestion Control States: Slow Start (exponential cwnd growth per RTT until ssthresh), Congestion Avoidance (linear growth cwnd += 1 MSS per RTT), and Fast Recovery upon 3 duplicate ACKs.'
    ],
    keyDefinitions: [
      { term: 'Cumulative ACK', explanation: 'TCP ACK indicates the sequence number of next expected byte, implicitly acknowledging all earlier bytes.' },
      { term: 'AIMD', explanation: 'Additive Increase Multiplicative Decrease: sender increases congestion window by 1 MSS per RTT and halves it on triple duplicate ACK.' }
    ],
    importantFormulasOrCode: [
      'EstimatedRTT = (1 - α) * EstimatedRTT + α * SampleRTT (typically α = 0.125)',
      'DevRTT = (1 - β) * DevRTT + β * |SampleRTT - EstimatedRTT| (typically β = 0.25)',
      'TimeoutInterval = EstimatedRTT + 4 * DevRTT'
    ],
    downloadFileName: '21CS52_Unit2_Transport_Venkatesh.pdf'
  },
  {
    id: 'note-503',
    subjectCode: '21CS53',
    subjectName: 'Database Management Systems',
    semester: 5,
    unit: 1,
    unitTitle: 'Relational Model, ER Modeling & SQL Foundation',
    title: 'Entity-Relationship Diagrams, Relational Algebra, DDL & DML Schema Design',
    topics: ['Database System Architecture', 'Weak Entities & Identifying Relationships', 'Relational Algebra Operators', 'Joins (Theta, Natural, Outer)', 'Complex SQL Subqueries & Group By', 'Integrity Constraints'],
    author: 'Dr. Anita Deshmukh',
    dateUpdated: '2024-09-12',
    pages: 46,
    fileSize: '3.9 MB',
    summary: 'Detailed explanation of 3-tier ANSI-SPARC architecture, ER-to-Relational conversion algorithms, relational algebra syntax, and constraint enforcement.',
    contentPreview: [
      '1. Conceptual Data Modeling: Entities, Attributes (Simple, Composite, Multi-valued, Derived), Key Attributes, Cardinality Ratios (1:1, 1:N, M:N), and Participation Constraints (Total vs Partial).',
      '2. ER to Relational Mapping: Regular entity types map to tables; 1:N relationships map by placing foreign key of 1-side into N-side table; M:N relationships require new junction table with composite primary keys.',
      '3. Relational Algebra Fundamentals: Selection (σ), Projection (π), Union (∪), Set Difference (-), Cartesian Product (×), Rename (ρ), and Natural Join (⋈).'
    ],
    keyDefinitions: [
      { term: 'Foreign Key Constraint', explanation: 'Referential integrity rule stating attribute values must match an existing primary key value in referenced table or be NULL.' },
      { term: 'Weak Entity', explanation: 'An entity type that cannot be identified solely by its own attributes and relies on an identifying owner entity.' }
    ],
    downloadFileName: '21CS53_Unit1_ER_Relational_Deshmukh.pdf'
  },
  {
    id: 'note-504',
    subjectCode: '21CS53',
    subjectName: 'Database Management Systems',
    semester: 5,
    unit: 3,
    unitTitle: 'Normalization & Functional Dependencies',
    title: '1NF, 2NF, 3NF, BCNF, Minimal Covers & Lossless Decomposition',
    topics: ['Update, Insertion, Deletion Anomalies', 'Armstrong Axioms', 'Attribute Closure Algorithm', 'Canonical Minimal Cover', 'Boyce-Codd Normal Form', 'Dependency Preservation Testing'],
    author: 'Dr. Anita Deshmukh',
    dateUpdated: '2024-10-15',
    pages: 52,
    fileSize: '4.4 MB',
    summary: 'Complete guide to removing redundancy via decomposition, closure calculation step-by-step examples, and proofs of lossless-join decomposition.',
    contentPreview: [
      '1. Pitfalls in Relational Design: Redundant data leads to storage overhead, update anomalies (inconsistent replicas), insertion anomalies (cannot add without dummy key), and deletion anomalies.',
      '2. Functional Dependency (FD): X -> Y holds in relation R if whenever two tuples agree on X, they must also agree on Y.',
      '3. Normal Forms Hierarchy: 1NF requires atomic attribute values. 2NF prohibits partial dependencies on any candidate key. 3NF prohibits transitive dependencies (for X -> A, either X is superkey or A is prime). BCNF requires X to be a superkey for every non-trivial X -> A.'
    ],
    downloadFileName: '21CS53_Unit3_Normalization_Deshmukh.pdf'
  },
  {
    id: 'note-505',
    subjectCode: '21CS54',
    subjectName: 'Automata Theory & Computability',
    semester: 5,
    unit: 1,
    unitTitle: 'Finite Automata & Regular Expressions',
    title: 'Deterministic & Non-Deterministic Finite Automata, Subset Construction',
    topics: ['Alphabets, Strings & Languages', 'DFA Formal 5-tuple Definition', 'NFA with ε-Transitions', 'Subset Construction Algorithm (NFA to DFA)', 'Regular Expression to Finite Automata', 'Pumping Lemma for Regular Languages'],
    author: 'Dr. Rajeshwari K.',
    dateUpdated: '2024-09-24',
    pages: 64,
    fileSize: '6.1 MB',
    summary: 'Theoretical state machine diagrams, transition tables, formal proofs of non-regularity with Pumping Lemma, and DFA state minimization via equivalence partitioning.',
    contentPreview: [
      '1. Formal Definition of DFA: 5-tuple M = (Q, Σ, δ, q0, F), where Q is finite states, Σ is alphabet, δ: Q × Σ -> Q is transition function, q0 ∈ Q is initial state, and F ⊆ Q is set of accept states.',
      '2. Equivalence of DFA and NFA: Every language recognized by an NFA can also be recognized by a DFA. The power set construction may yield up to 2^|Q| states in the worst case.',
      '3. Pumping Lemma for Regular Languages: If L is regular, there exists a constant p such that any string w ∈ L with |w| >= p can be divided into w = xyz satisfying |y| > 0, |xy| <= p, and xy^i z ∈ L for all i >= 0.'
    ],
    downloadFileName: '21CS54_Unit1_FiniteAutomata_Rajeshwari.pdf'
  },
  {
    id: 'note-401',
    subjectCode: '21CS41',
    subjectName: 'Design & Analysis of Algorithms',
    semester: 4,
    unit: 1,
    unitTitle: 'Asymptotic Analysis & Divide-and-Conquer',
    title: 'Recurrence Relations, Master Theorem, Merge Sort & Quick Sort',
    topics: ['Big-O, Big-Omega, Big-Theta Definitions', 'Recursion Tree Method', 'Master Theorem for Divide-and-Conquer', 'QuickSort Partitioning (Lomuto vs Hoare)', 'Strassen Matrix Multiplication', 'Lower Bounds for Comparison Sorting'],
    author: 'Prof. P. R. Murthy',
    dateUpdated: '2024-03-14',
    pages: 48,
    fileSize: '4.2 MB',
    summary: 'Formal complexity bounds, step-by-step Master theorem cases, best/worst-case proofs for partition sorting algorithms, and inversion count problems.',
    contentPreview: [
      '1. Asymptotic Notations: f(n) = O(g(n)) means positive constants c and n0 exist such that 0 <= f(n) <= c*g(n) for all n >= n0.',
      '2. Master Theorem: T(n) = a*T(n/b) + f(n). Compares f(n) with n^(log_b(a)). Three standard cases govern sub-polynomial, polynomial, and super-polynomial growth.',
      '3. QuickSort Analysis: Worst case recurrence T(n) = T(n-1) + O(n) giving O(n^2). Average case recurrence yields O(n log n) through expected indicator random variables.'
    ],
    downloadFileName: '21CS41_Unit1_DivideConquer_Murthy.pdf'
  },
  {
    id: 'note-402',
    subjectCode: '21CS42',
    subjectName: 'Operating Systems',
    semester: 4,
    unit: 2,
    unitTitle: 'Process Synchronization & Concurrency',
    title: 'Critical Section Problem, Peterson Solution, Semaphores, Monitors & Deadlocks',
    topics: ['Race Conditions', 'Peterson Algorithm Proof', 'Hardware Atomic Instructions (TestAndSet, CAS)', 'Counting & Binary Semaphores', 'Classical Problems: Producer-Consumer, Dining Philosophers', 'Banker Algorithm for Deadlock Avoidance'],
    author: 'Dr. Sneha Patil',
    dateUpdated: '2024-04-05',
    pages: 50,
    fileSize: '4.7 MB',
    summary: 'Classic synchronization paradigms, monitor constructs with condition variables, deadlock detection matrices, and resource allocation graphs.',
    contentPreview: [
      '1. Critical Section Requirements: Mutual Exclusion (only one process in CS), Progress (selection cannot be postponed indefinitely), Bounded Waiting (limit on times other processes enter CS before request granted).',
      '2. Semaphores: Integer variable accessible only through atomic wait() [P] and signal() [V] primitives. Counting semaphores control access to a finite resource pool.',
      '3. Deadlock Necessary Conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. All four must hold simultaneously for a deadlock to exist.'
    ],
    downloadFileName: '21CS42_Unit2_Synchronization_Patil.pdf'
  }
];

export const MOCK_QUESTION_PAPERS: QuestionPaperItem[] = [
  {
    id: 'qp-2024-52',
    subjectCode: '21CS52',
    subjectName: 'Computer Networks & Security',
    semester: 5,
    year: 2024,
    examType: 'Semester End (SEE)',
    scheme: '2021 Scheme',
    totalMarks: 100,
    fileSize: '1.8 MB',
    hasSolutions: true,
    sections: [
      {
        title: 'Module 1 (Application Layer)',
        questions: [
          { qNum: 'Q1 (a)', text: 'Distinguish between client-server and peer-to-peer network architectures with illustrative diagrams.', marks: 8, module: 'Unit 1' },
          { qNum: 'Q1 (b)', text: 'Explain the working of HTTP persistent and non-persistent connections with Round Trip Time (RTT) timing diagrams.', marks: 12, module: 'Unit 1' },
          { qNum: 'Q2 (a)', text: 'With a neat sequence diagram, elucidate how an iterative DNS query is resolved for an authorative domain name.', marks: 10, module: 'Unit 1' },
          { qNum: 'Q2 (b)', text: 'Demonstrate socket programming flow for a connection-oriented TCP client and server with code primitives.', marks: 10, module: 'Unit 1' }
        ]
      },
      {
        title: 'Module 2 (Transport Layer)',
        questions: [
          { qNum: 'Q3 (a)', text: 'Explain the Go-Back-N (GBN) sliding window protocol with sender and receiver finite state machines.', marks: 10, module: 'Unit 2' },
          { qNum: 'Q3 (b)', text: 'Calculate the TCP timeout interval given SampleRTT = 28ms, EstimatedRTT = 24ms, and DevRTT = 4ms. Show formula steps.', marks: 10, module: 'Unit 2' },
          { qNum: 'Q4 (a)', text: 'Compare TCP Reno and TCP Tahoe congestion control algorithms during timeout and triple duplicate ACK states.', marks: 12, module: 'Unit 2' }
        ]
      }
    ],
    downloadFileName: '21CS52_SEE_Jan2024_Paper.pdf'
  },
  {
    id: 'qp-2023-52',
    subjectCode: '21CS52',
    subjectName: 'Computer Networks & Security',
    semester: 5,
    year: 2023,
    examType: 'Semester End (SEE)',
    scheme: '2021 Scheme',
    totalMarks: 100,
    fileSize: '1.6 MB',
    hasSolutions: true,
    sections: [
      {
        title: 'Module 1 & 2',
        questions: [
          { qNum: 'Q1', text: 'Derive the total nodal delay formula and explain transmission vs propagation delay with a numerical example.', marks: 10, module: 'Unit 1' },
          { qNum: 'Q2', text: 'Elucidate TCP 3-way handshake mechanism and 4-way connection teardown with segment sequence numbers.', marks: 10, module: 'Unit 2' },
          { qNum: 'Q3', text: 'Describe Selective Repeat protocol and discuss why the window size must be less than or equal to half the sequence space.', marks: 10, module: 'Unit 2' }
        ]
      }
    ],
    downloadFileName: '21CS52_SEE_Jan2023_Paper.pdf'
  },
  {
    id: 'qp-2024-53',
    subjectCode: '21CS53',
    subjectName: 'Database Management Systems',
    semester: 5,
    year: 2024,
    examType: 'Semester End (SEE)',
    scheme: '2021 Scheme',
    totalMarks: 100,
    fileSize: '2.1 MB',
    hasSolutions: true,
    sections: [
      {
        title: 'Module 1 & 2',
        questions: [
          { qNum: 'Q1 (a)', text: 'Construct an ER diagram for a Hospital Management System showing cardinalities, weak entities, and composite attributes.', marks: 12, module: 'Unit 1' },
          { qNum: 'Q1 (b)', text: 'Define the fundamental operations in relational algebra with algebraic expressions and examples.', marks: 8, module: 'Unit 1' },
          { qNum: 'Q2 (a)', text: 'Write SQL queries using correlated subqueries, LEFT OUTER JOIN, and GROUP BY HAVING clauses on a schema.', marks: 10, module: 'Unit 2' }
        ]
      },
      {
        title: 'Module 3 (Normalization)',
        questions: [
          { qNum: 'Q3 (a)', text: 'Given relation R(A, B, C, D, E) and FDs {A->BC, CD->E, B->D, E->A}, find candidate keys and determine normal form.', marks: 12, module: 'Unit 3' },
          { qNum: 'Q3 (b)', text: 'State Armstrong axioms. Prove the pseudo-transitivity rule using the inference axioms.', marks: 8, module: 'Unit 3' }
        ]
      }
    ],
    downloadFileName: '21CS53_SEE_Feb2024_Paper.pdf'
  },
  {
    id: 'qp-2023-53',
    subjectCode: '21CS53',
    subjectName: 'Database Management Systems',
    semester: 5,
    year: 2023,
    examType: 'Semester End (SEE)',
    scheme: '2021 Scheme',
    totalMarks: 100,
    fileSize: '1.9 MB',
    hasSolutions: false,
    sections: [
      {
        title: 'All Modules',
        questions: [
          { qNum: 'Q1', text: 'Explain 3-tier ANSI SPARC database architecture and data independence (Physical and Logical).', marks: 10, module: 'Unit 1' },
          { qNum: 'Q2', text: 'Compute canonical cover for F = {A->BC, B->C, A->B, AB->C}. Verify step by step.', marks: 10, module: 'Unit 3' }
        ]
      }
    ],
    downloadFileName: '21CS53_SEE_Jan2023_Paper.pdf'
  },
  {
    id: 'qp-2024-41',
    subjectCode: '21CS41',
    subjectName: 'Design & Analysis of Algorithms',
    semester: 4,
    year: 2024,
    examType: 'Semester End (SEE)',
    scheme: '2021 Scheme',
    totalMarks: 100,
    fileSize: '1.7 MB',
    hasSolutions: true,
    sections: [
      {
        title: 'Module 1 & 2',
        questions: [
          { qNum: 'Q1 (a)', text: 'State and prove the Master theorem for divide-and-conquer recurrences with all three canonical cases.', marks: 10, module: 'Unit 1' },
          { qNum: 'Q1 (b)', text: 'Write the QuickSort algorithm with Hoare partition scheme and trace on array [35, 12, 67, 44, 28, 9, 81].', marks: 10, module: 'Unit 1' },
          { qNum: 'Q2 (a)', text: 'Solve 0/1 Knapsack problem using dynamic programming with capacity W = 8 and items given.', marks: 10, module: 'Unit 3' }
        ]
      }
    ],
    downloadFileName: '21CS41_SEE_July2024_Paper.pdf'
  },
  {
    id: 'qp-2022-54',
    subjectCode: '21CS54',
    subjectName: 'Automata Theory & Computability',
    semester: 5,
    year: 2022,
    examType: 'Semester End (SEE)',
    scheme: '2018 Scheme',
    totalMarks: 100,
    fileSize: '1.5 MB',
    hasSolutions: true,
    sections: [
      {
        title: 'Module 1',
        questions: [
          { qNum: 'Q1', text: 'Design DFA to accept all binary strings containing the substring 101 or ending with 00.', marks: 10, module: 'Unit 1' },
          { qNum: 'Q2', text: 'Using Pumping Lemma, prove that language L = {a^n b^n | n >= 0} is not regular.', marks: 10, module: 'Unit 1' }
        ]
      }
    ],
    downloadFileName: '21CS54_SEE_Jan2022_Paper.pdf'
  }
];

export const MOCK_LAB_MANUALS: LabManualItem[] = [
  {
    id: 'lab-56',
    courseCode: '21CSL56',
    courseName: 'Database Applications & Web Development Lab',
    semester: 5,
    labIncharge: 'Dr. Anita Deshmukh & Prof. Raghavendra',
    totalExperiments: 6,
    fileSize: '8.4 MB',
    softwareRequired: ['MySQL Server 8.0', 'Node.js / Express', 'PostgreSQL', 'VS Code', 'Git'],
    objectives: [
      'Master schema definition, complex joins, triggers, and stored procedures in relational DBMS.',
      'Build end-to-end full-stack web applications binding database transactions with REST API controllers.',
      'Understand transaction isolation levels, indexing performance, and parameterized security against SQL injection.'
    ],
    experiments: [
      {
        number: 1,
        title: 'Library Management Database & Relational Queries',
        objective: 'Design and implement an ER model, map to relational tables with appropriate PK/FK constraints, and execute nested subqueries and joins.',
        prerequisites: 'Basic SQL DDL/DML, Foreign Key Cascade Rules',
        algorithmSteps: [
          'Create tables: BOOK, BOOK_AUTHORS, PUBLISHER, BOOK_COPIES, BOOK_LENDING, LIBRARY_BRANCH.',
          'Enforce primary keys, not-null constraints, and on-delete cascade foreign key associations.',
          'Populate test records representing at least 5 branches and 10 titles.',
          'Execute query: Retrieve book titles authored by a specific author and loaned between specific dates.'
        ],
        codeLanguage: 'sql',
        sampleCodeSnippet: `-- Experiment 1: Schema creation & nested analytical query
CREATE TABLE PUBLISHER (
  Name VARCHAR(50) PRIMARY KEY,
  Address VARCHAR(100),
  Phone VARCHAR(15)
);

CREATE TABLE BOOK (
  Book_id INT PRIMARY KEY,
  Title VARCHAR(100) NOT NULL,
  Publisher_Name VARCHAR(50) REFERENCES PUBLISHER(Name) ON DELETE CASCADE
);

CREATE TABLE BOOK_COPIES (
  Book_id INT REFERENCES BOOK(Book_id) ON DELETE CASCADE,
  Branch_id INT,
  No_of_Copies INT CHECK (No_of_Copies >= 0),
  PRIMARY KEY (Book_id, Branch_id)
);

-- Retrieve book titles authored by 'Navathe' having > 2 copies in Central Branch
SELECT B.Title, BC.No_of_Copies 
FROM BOOK B 
JOIN BOOK_COPIES BC ON B.Book_id = BC.Book_id
JOIN BOOK_AUTHORS BA ON B.Book_id = BA.Book_id
WHERE BA.Author_Name = 'Navathe' AND BC.Branch_id = 101;`,
        expectedOutput: `+----------------------------------+--------------+
| Title                            | No_of_Copies |
+----------------------------------+--------------+
| Fundamentals of Database Systems | 5            |
| Database System Concepts         | 3            |
+----------------------------------+--------------+`,
        vivaQuestions: [
          { question: 'What happens when ON DELETE CASCADE is omitted and parent row is deleted?', answer: 'The database engine raises a foreign key constraint violation error and halts deletion.' },
          { question: 'Why is an index recommended on foreign key columns?', answer: 'Because foreign key joins occur frequently and lack of indexing triggers sequential table scans.' }
        ]
      },
      {
        number: 2,
        title: 'Automated Inventory Update using SQL Triggers',
        objective: 'Write and test a database trigger that automatically decrements stock count whenever a sale transaction is committed, raising exceptions on negative stock.',
        prerequisites: 'PL/SQL triggers, BEFORE vs AFTER row triggers',
        algorithmSteps: [
          'Define PRODUCTS table with StockQty and ORDERS table.',
          'Write a BEFORE INSERT trigger on ORDERS checking if requested quantity exceeds current StockQty.',
          'If stock is insufficient, signal SQLSTATE exception with custom error message.',
          'If valid, update PRODUCTS table reducing StockQty by NEW.Quantity.'
        ],
        codeLanguage: 'sql',
        sampleCodeSnippet: `DELIMITER $$
CREATE TRIGGER trg_verify_and_update_stock
BEFORE INSERT ON ORDERS
FOR EACH ROW
BEGIN
  DECLARE available_qty INT;
  SELECT StockQty INTO available_qty 
  FROM PRODUCTS WHERE ProductId = NEW.ProductId;
  
  IF available_qty < NEW.OrderQty THEN
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = 'Order denied: Insufficient inventory stock!';
  ELSE
    UPDATE PRODUCTS 
    SET StockQty = StockQty - NEW.OrderQty 
    WHERE ProductId = NEW.ProductId;
  END IF;
END$$
DELIMITER ;`,
        expectedOutput: `Query OK, 0 rows affected (0.02 sec)
Trigger 'trg_verify_and_update_stock' compiled successfully.`,
        vivaQuestions: [
          { question: 'What is the distinction between statement-level and row-level triggers?', answer: 'Row-level triggers execute once for each affected tuple (FOR EACH ROW), whereas statement-level triggers fire once per SQL operation.' },
          { question: 'Can a BEFORE trigger mutate values in the NEW pseudorecord?', answer: 'Yes, in a BEFORE trigger you can assign NEW.column_name := value before persistence.' }
        ]
      },
      {
        number: 3,
        title: 'RESTful API with Parameterized Queries & Express.js',
        objective: 'Implement secure REST endpoints to perform CRUD operations on student academic records avoiding SQL injection attacks.',
        prerequisites: 'Node.js, Express, pg / mysql2 connection pool',
        algorithmSteps: [
          'Initialize Express router with GET, POST, PUT, DELETE routes.',
          'Establish connection pool with connection limits.',
          'Use parameterized place-holders ($1, $2 or ?) to ensure payload inputs are never concatenated directly into query strings.',
          'Return consistent JSON responses with appropriate HTTP status codes (200, 201, 400, 404, 500).'
        ],
        codeLanguage: 'typescript',
        sampleCodeSnippet: `import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const router = express.Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Secure parameterized search
router.get('/students/:usn', async (req: Request, res: Response) => {
  const { usn } = req.params;
  try {
    const result = await pool.query(
      'SELECT usn, name, semester, department, cgpa FROM students WHERE usn = $1',
      [usn]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student USN record not found' });
    }
    return res.status(200).json({ data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ error: 'Database execution failed' });
  }
});`,
        expectedOutput: `HTTP/1.1 200 OK
Content-Type: application/json
{
  "data": {
    "usn": "1MS21CS042",
    "name": "Aditya Sharma",
    "semester": 5,
    "department": "CSE",
    "cgpa": 9.18
  }
}`,
        vivaQuestions: [
          { question: 'How do parameterized queries prevent SQL Injection?', answer: 'The database treats parameterized values strictly as data literals during query plan compilation, making code injection impossible.' }
        ]
      }
    ],
    downloadFileName: '21CSL56_DBMS_Web_Lab_Manual_2024.pdf'
  },
  {
    id: 'lab-57',
    courseCode: '21CSL57',
    courseName: 'Computer Networks Laboratory',
    semester: 5,
    labIncharge: 'Prof. K. Venkatesh & Mrs. Divya',
    totalExperiments: 6,
    fileSize: '6.7 MB',
    softwareRequired: ['NS-2 / NS-3 Network Simulator', 'Wireshark', 'GCC / C++ Compiler', 'Python 3 Socket API'],
    objectives: [
      'Simulate point-to-point and LAN networks using NS2/NS3 network simulation scripts.',
      'Analyze TCP vs UDP throughput, packet loss, and queue congestion graphs.',
      'Implement CRC error detection, Bellman-Ford, and Dijkstra routing algorithms in C/C++.'
    ],
    experiments: [
      {
        number: 1,
        title: 'CRC (Cyclic Redundancy Check) Error Detection',
        objective: 'Implement CRC 16-bit generator polynomial to compute frame check sequence (FCS) at sender and detect bit corruption at receiver.',
        prerequisites: 'Binary polynomial division, modulo-2 arithmetic, XOR operations',
        algorithmSteps: [
          'Read dataword bit string and predefined divisor generator polynomial (e.g. CRC-CCITT: 10001000000100001).',
          'Append (k-1) zero bits to the dataword, where k is generator length.',
          'Perform bitwise modulo-2 division using binary XOR operations.',
          'Replace appended zeros with the computed remainder to form transmitted codeword.',
          'At receiver, divide received codeword by generator. Zero remainder confirms error-free reception.'
        ],
        codeLanguage: 'cpp',
        sampleCodeSnippet: `#include <iostream>
#include <string>
using namespace std;

string xorOperation(string a, string b) {
  string result = "";
  for (size_t i = 1; i < b.length(); i++) {
    result += (a[i] == b[i]) ? '0' : '1';
  }
  return result;
}

string modulo2Division(string dividend, string divisor) {
  int pick = divisor.length();
  string tmp = dividend.substr(0, pick);
  int n = dividend.length();
  
  while (pick < n) {
    if (tmp[0] == '1')
      tmp = xorOperation(divisor, tmp) + dividend[pick];
    else
      tmp = xorOperation(string(divisor.length(), '0'), tmp) + dividend[pick];
    pick += 1;
  }
  if (tmp[0] == '1')
    tmp = xorOperation(divisor, tmp);
  else
    tmp = xorOperation(string(divisor.length(), '0'), tmp);
  return tmp;
}`,
        expectedOutput: `Enter Dataword: 11010011101100
Generator Polynomial: 1011
Computed CRC Remainder Checksum: 010
Transmitted Codeword: 11010011101100010
Receiver Test: No errors detected. Remainder: 000`,
        vivaQuestions: [
          { question: 'What types of errors does CRC reliably detect?', answer: 'All single-bit errors, all double-bit errors (with appropriate polynomial), odd number of errors, and burst errors of length <= generator degree.' }
        ]
      },
      {
        number: 2,
        title: 'Bellman-Ford Distance Vector Routing Algorithm',
        objective: 'Implement Distance Vector routing protocol calculating minimum-cost forwarding paths from source to all destinations in a weighted graph.',
        prerequisites: 'Graph representations, relaxation technique, dynamic programming',
        algorithmSteps: [
          'Initialize distance array dist[V] to infinity, dist[source] = 0.',
          'Relax all edges (V - 1) times: if dist[u] + weight(u, v) < dist[v] then dist[v] = dist[u] + weight(u, v).',
          'Run a V-th iteration to check for negative-weight cycles.',
          'Print final routing table showing destination and shortest distance.'
        ],
        codeLanguage: 'cpp',
        sampleCodeSnippet: `// Bellman-Ford algorithm core relaxation loop
for (int i = 1; i <= V - 1; ++i) {
  for (int j = 0; j < E; ++j) {
    int u = edges[j].src;
    int v = edges[j].dest;
    int weight = edges[j].weight;
    if (dist[u] != INT_MAX && dist[u] + weight < dist[v]) {
      dist[v] = dist[u] + weight;
    }
  }
}`,
        expectedOutput: `Routing Table for Node A:
Destination | Distance | Next Hop
Node B      | 2        | B
Node C      | 5        | B
Node D      | 7        | D
Node E      | 9        | B`,
        vivaQuestions: [
          { question: 'What is the Count-to-Infinity problem in Distance Vector routing?', answer: 'Routing loops occur when a link fails, causing adjacent nodes to iteratively increment hop counts infinitely until metric reaches infinity threshold.' }
        ]
      }
    ],
    downloadFileName: '21CSL57_Networks_Lab_Manual_2024.pdf'
  },
  {
    id: 'lab-46',
    courseCode: '21CSL46',
    courseName: 'Algorithms Laboratory',
    semester: 4,
    labIncharge: 'Prof. P. R. Murthy',
    totalExperiments: 8,
    fileSize: '5.9 MB',
    softwareRequired: ['GCC / Clang', 'Gnuplot for runtime curves', 'Linux Environment'],
    objectives: [
      'Empirically evaluate asymptotic time complexity across varying input sizes n.',
      'Implement Greedy, Divide-and-Conquer, Dynamic Programming, and Backtracking algorithms.'
    ],
    experiments: [
      {
        number: 1,
        title: 'Kruskal Minimum Spanning Tree using Disjoint Sets',
        objective: 'Find the Minimum Spanning Tree of an undirected weighted network graph using Union-Find by rank with path compression.',
        prerequisites: 'Disjoint Set Union (DSU), Greedy paradigm, Edge sorting',
        algorithmSteps: [
          'Sort all edges in non-decreasing order of their weights.',
          'Initialize disjoint set parent pointers for each vertex.',
          'Iterate through sorted edges: if find(u) != find(v), add edge to MST and union sets.',
          'Repeat until (V - 1) edges are included in MST.'
        ],
        codeLanguage: 'cpp',
        sampleCodeSnippet: `struct Edge { int src, dest, weight; };

int findParent(int node, vector<int>& parent) {
  if (node == parent[node]) return node;
  return parent[node] = findParent(parent[node], parent); // Path compression
}

void unionSets(int u, int v, vector<int>& parent, vector<int>& rank) {
  u = findParent(u, parent);
  v = findParent(v, parent);
  if (rank[u] < rank[v]) parent[u] = v;
  else if (rank[u] > rank[v]) parent[v] = u;
  else { parent[v] = u; rank[u]++; }
}`,
        expectedOutput: `MST Edges Included:
Edge (1, 2) Weight = 1
Edge (2, 3) Weight = 2
Edge (3, 4) Weight = 3
Total Minimum Spanning Tree Weight: 6`,
        vivaQuestions: [
          { question: 'What is the worst-case time complexity of Kruskal algorithm?', answer: 'O(E log E) or O(E log V) dominated by sorting the edges.' }
        ]
      }
    ],
    downloadFileName: '21CSL46_Algorithms_Lab_Manual_2024.pdf'
  }
];

export const MOCK_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'Commencement of 5th Semester Lab Internal Assessments (CIE-2)',
    category: 'Lab Timetable',
    date: '2024-10-28',
    author: 'Department Exam Cell',
    priority: 'high',
    pinned: true,
    content: 'The second Continuous Internal Evaluation (CIE-2) for 21CSL56 (DBMS & Web Lab) and 21CSL57 (Networks Lab) will be conducted between November 12 and November 16, 2024. All students are required to submit duly verified and signed laboratory observation notebooks and record journals prior to entering the exam venue. Batch allocation schedule is published below.',
    attachmentName: 'CIE2_Lab_Schedule_Nov2024.pdf'
  },
  {
    id: 'ann-2',
    title: 'Semester End Examination (SEE) Time Table & Hall Ticket Release',
    category: 'Examinations',
    date: '2024-10-20',
    author: 'Controller of Examinations',
    priority: 'high',
    pinned: true,
    content: 'Draft Time Table for 3rd, 5th, and 7th Semester B.E. Semester End Examinations (Dec 2024 / Jan 2025) has been officially gazetted. Students may download their provisional hall tickets from the student portal starting Nov 25 after clearing attendance condonation requirements (minimum 75% aggregate per theory course).',
    attachmentName: 'SEE_Timetable_ODD_Sem_2024_25.pdf'
  },
  {
    id: 'ann-3',
    title: 'Guest Lecture: Scalable Microservices Architecture with Kubernetes',
    category: 'Guest Lecture',
    date: '2024-10-14',
    author: 'CSE Student Association',
    priority: 'normal',
    pinned: false,
    content: 'The Department of Computer Science & Engineering is organizing an industry interactive technical session with alumni Mr. Karthik Sundar (Principal Architect, Atlassian). Topics include distributed consensus with Raft, container orchestration with K8s, and event-driven architectures with Kafka. Date: Nov 8, 2024 at 10:30 AM in Auditorium-1.',
    attachmentName: 'Microservices_Session_Flyer.pdf'
  },
  {
    id: 'ann-4',
    title: 'Phase-1 Major Project Review Submission Guidelines (7th Sem)',
    category: 'Project Review',
    date: '2024-10-08',
    author: 'Project Review Committee',
    priority: 'normal',
    pinned: false,
    content: 'All final year project batches must upload their preliminary SRS document, system architectural block diagrams, and project plan Gantt charts to the department coordinator by Nov 5, 2024. Reviews will be held in the Seminar Hall with departmental project guides.',
    attachmentName: 'MajorProject_Phase1_Rubrics.pdf'
  }
];
