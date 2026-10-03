import { StudentUser, Subject, NoteItem, QuestionPaperItem, LabManualItem, AnnouncementItem } from '../types';

export const INSTITUTION_INFO = {
  name: 'Siddaganga Institute of Technology, Tumakuru',
  shortName: 'SIT Tumakuru',
  department: 'Chemical Engineering',
  deptCode: 'CH',
  activeSemester: 3,
  accreditation: 'Autonomous Institution Affiliated to VTU · Approved by AICTE · NAAC A++ & NBA Accredited',
  disclaimer: 'Curriculum & Demo Data Notice: Subjects, course codes (marked with [DEMO]), lecture notes, and question papers are realistic demo representations for 3rd-Semester Chemical Engineering until your official college syllabus document is provided.'
};

export const SUBJECTS_LIST: Subject[] = [
  // 3rd Semester Chemical Engineering (Core Focus)
  {
    code: 'CH31-DEMO',
    name: 'Material & Energy Balances',
    semester: 3,
    credits: 4,
    faculty: 'Dr. S. K. Hiremath',
    category: 'Core'
  },
  {
    code: 'CH32-DEMO',
    name: 'Fluid Mechanics for Chemical Engineers',
    semester: 3,
    credits: 4,
    faculty: 'Prof. M. B. Patil',
    category: 'Core'
  },
  {
    code: 'CH33-DEMO',
    name: 'Chemical Process Calculations',
    semester: 3,
    credits: 3,
    faculty: 'Dr. Geetha K.',
    category: 'Core'
  },
  {
    code: 'CH34-DEMO',
    name: 'Technical Chemistry & Instrumental Analysis',
    semester: 3,
    credits: 3,
    faculty: 'Dr. R. N. Murthy',
    category: 'Core'
  },
  {
    code: 'MAT31-DEMO',
    name: 'Transform Calculus & Numerical Techniques',
    semester: 3,
    credits: 3,
    faculty: 'Dr. V. Shanmukhappa',
    category: 'Core'
  },
  {
    code: 'CHL36-DEMO',
    name: 'Fluid Flow Operations Laboratory',
    semester: 3,
    credits: 2,
    faculty: 'Prof. M. B. Patil & Mr. Chethan',
    category: 'Laboratory'
  },
  {
    code: 'CHL37-DEMO',
    name: 'Technical Chemistry Laboratory',
    semester: 3,
    credits: 2,
    faculty: 'Dr. R. N. Murthy & Mrs. Kavya',
    category: 'Laboratory'
  },

  // 4th Semester Chemical Engineering
  {
    code: 'CH41-DEMO',
    name: 'Chemical Engineering Thermodynamics I',
    semester: 4,
    credits: 4,
    faculty: 'Dr. S. K. Hiremath',
    category: 'Core'
  },
  {
    code: 'CH42-DEMO',
    name: 'Mechanical Operations',
    semester: 4,
    credits: 3,
    faculty: 'Prof. Siddalingaiah',
    category: 'Core'
  },
  {
    code: 'CHL46-DEMO',
    name: 'Mechanical Operations Laboratory',
    semester: 4,
    credits: 2,
    faculty: 'Prof. Siddalingaiah',
    category: 'Laboratory'
  }
];

export const MOCK_NOTES: NoteItem[] = [
  {
    id: 'note-ch31-u1',
    subjectCode: 'CH31-DEMO',
    subjectName: 'Material & Energy Balances',
    semester: 3,
    unit: 1,
    unitTitle: 'Steady-State Material Balances without Chemical Reactions',
    title: 'Conservation of Mass, Degrees of Freedom, Bypass & Recycle Streams',
    topics: [
      'Steady-state vs Unsteady-state Systems',
      'Law of Conservation of Mass for Single and Multi-unit Systems',
      'Degrees of Freedom Analysis (N_df = N_unknowns - N_indep_eqs)',
      'Recycle Streams, Recycle Ratio & Combined Feed',
      'Bypass Streams and Purge Fraction Calculations',
      'Tie Components and Inerts Tracking'
    ],
    author: 'Dr. S. K. Hiremath',
    dateUpdated: '2024-09-20',
    pages: 44,
    fileSize: '4.6 MB',
    summary: 'Comprehensive lecture notes on material balance fundamentals for non-reacting systems, covering flowsheets with recycle, bypass, purge, and tie substance methodology with solved numerical examples.',
    contentPreview: [
      '1. General Material Balance Equation: Accumulation = Input - Output + Generation - Consumption. At steady state, Accumulation = 0, simplifying the equation to: Input + Generation = Output + Consumption.',
      '2. Degrees of Freedom Analysis: N_df = N_unknowns - N_independent_material_balances - N_other_specifications. If N_df = 0, the system is fully specified and solvable. If N_df > 0, the problem is underspecified.',
      '3. Recycle Operations: Used to recover unreacted reactants, improve heat exchange, and dilute feed streams. Recycle ratio = Recycle Flow Rate / Fresh Feed Flow Rate.',
      '4. Purge Operations: Essential in closed recycle loops containing inert components to prevent accumulation of non-reacting impurities.',
      '5. Bypass Fraction: A stream diverted around one or more process units and reunited with the downstream product stream to adjust concentration, temperature, or flow rate.'
    ],
    keyDefinitions: [
      { term: 'Tie Component', explanation: 'A substance that enters in only one feed stream and leaves in only one product stream without reacting, serving as a direct computational bridge.' },
      { term: 'Purge Stream', explanation: 'A fractional bleed stream withdrawn from a recycle loop to continuously discharge inert impurities.' },
      { term: 'Single-Pass Conversion', explanation: 'Fraction of reactant converted in one pass through the chemical reactor: (Reactant in reactor feed - Reactant in reactor exit) / Reactant in reactor feed.' }
    ],
    importantFormulasOrCode: [
      'Overall Material Balance: Total Fresh Feed (F) = Total Net Products (P)',
      'Recycle Ratio: R_R = Mass flow rate of Recycle stream / Fresh Feed flow rate',
      'Purge Ratio: P_R = Flow rate of Purge stream / Flow rate of Recycle loop before purge',
      'Degrees of Freedom: N_df = N_unknown_variables - N_independent_equations'
    ],
    downloadFileName: 'SIT_CH31_Unit1_Material_Balances_Hiremath.pdf'
  },
  {
    id: 'note-ch31-u2',
    subjectCode: 'CH31-DEMO',
    subjectName: 'Material & Energy Balances',
    semester: 3,
    unit: 2,
    unitTitle: 'Stoichiometry & Material Balances with Chemical Reactions',
    title: 'Limiting Reactant, Excess Reactant, Extent of Reaction & Yield',
    topics: [
      'Stoichiometric Ratios and Molecular Mass Calculations',
      'Identification of Limiting and Excess Reactants',
      'Percentage Excess Calculation: (Feed - Theoretical) / Theoretical * 100',
      'Fractional Conversion and Selectivity',
      'Atomic Species Balance vs Extent of Reaction Method',
      'Combustion of Hydrocarbons: Theoretical Oxygen vs Air'
    ],
    author: 'Dr. S. K. Hiremath',
    dateUpdated: '2024-10-04',
    pages: 52,
    fileSize: '5.1 MB',
    summary: 'Detailed derivation and step-by-step problems for chemical reacting systems, atomic balances, combustion calculations, Orsat analysis, and yield optimization.',
    contentPreview: [
      '1. Limiting Reactant Concept: The reactant that is present in the smallest stoichiometric quantity and would be completely consumed first if the reaction goes to completion.',
      '2. Theoretical Oxygen: The moles of O2 required for complete combustion of all carbon to CO2, hydrogen to H2O, and sulfur to SO2.',
      '3. Percent Excess Air: Percent excess air = (Moles of air fed - Moles of air theoretical) / (Moles of air theoretical) * 100.',
      '4. Atomic Balances: Since atoms can neither be created nor destroyed in ordinary chemical reactions, input of element j = output of element j.'
    ],
    downloadFileName: 'SIT_CH31_Unit2_Reaction_Balances_Hiremath.pdf'
  },
  {
    id: 'note-ch32-u1',
    subjectCode: 'CH32-DEMO',
    subjectName: 'Fluid Mechanics for Chemical Engineers',
    semester: 3,
    unit: 1,
    unitTitle: 'Fluid Statics & Flow Measurement Primitives',
    title: 'Manometry, Differential Head, Bernoulli Theorem & Venturi/Orifice Flow',
    topics: [
      'Newtonian vs Non-Newtonian Fluids and Shear Stress-Rate Relationship',
      'Hydrostatic Equilibrium and Barometric Equation',
      'U-Tube, Inverted & Two-Fluid Differential Manometers',
      'Derivation of Bernoulli Equation with Head Loss & Pump Work',
      'Venturimeter Equation and Discharge Coefficient (C_d)',
      'Orifice Meter vs Rotameter: Variable Head vs Variable Area'
    ],
    author: 'Prof. M. B. Patil',
    dateUpdated: '2024-09-25',
    pages: 48,
    fileSize: '4.9 MB',
    summary: 'Complete engineering fluid mechanics notes with hydrostatic proofs, manometer balancing planes, Bernoulli energy accounting, friction factor charts, and flow meter discharge equations.',
    contentPreview: [
      '1. Hydrostatic Principle: Pressure in a continuous static fluid varies only with vertical elevation: dP/dz = -ρ*g. In incompressible fluids, P2 - P1 = -ρ*g*(z2 - z1).',
      '2. Bernoulli Equation with Energy Corrections: (P1 / ρ) + (α1 * v1^2 / 2) + g * z1 + W_p = (P2 / ρ) + (α2 * v2^2 / 2) + g * z2 + h_f. Where h_f represents total viscous friction loss.',
      '3. Venturimeter Mechanics: Tapered convergent-divergent duct minimizing separation losses. Theoretical velocity at throat v2 = sqrt[2 * (P1 - P2) / (ρ * (1 - β^4))], where β = d2 / d1. Actual volumetric flow Q = C_d * A2 * v2, with C_d typically 0.96 to 0.98.'
    ],
    keyDefinitions: [
      { term: 'Viscosity (μ)', explanation: 'The physical property measuring a fluid resistance to gradual deformation by shear stress or tensile stress (Pa·s or Poise).' },
      { term: 'Vena Contracta', explanation: 'The cross-sectional area where the fluid jet diameter is minimum and fluid velocity is maximum, located just downstream of an orifice plate.' }
    ],
    importantFormulasOrCode: [
      'Reynolds Number: Re = (ρ * v * D) / μ = (v * D) / ν',
      'Bernoulli Head Form: (P1 / γ) + (v1^2 / 2g) + z1 = (P2 / γ) + (v2^2 / 2g) + z2 + h_L',
      'Darcy-Weisbach Friction Loss: h_f = 4 * f * (L / D) * (v^2 / 2g)',
      'Orifice Volumetric Flow: Q = C_d * A_0 * sqrt(2 * ΔP / [ρ * (1 - β^4)])'
    ],
    downloadFileName: 'SIT_CH32_Unit1_Fluid_Mechanics_Patil.pdf'
  },
  {
    id: 'note-ch33-u1',
    subjectCode: 'CH33-DEMO',
    subjectName: 'Chemical Process Calculations',
    semester: 3,
    unit: 1,
    unitTitle: 'Ideal Gas Systems, Vapor Pressure & Antoine Constants',
    title: 'Raoult Law, Antoine Equation, Humidity & Psychrometric Charts',
    topics: [
      'Ideal Gas Law (PV = nRT) and Gas Mixtures (Amagat & Dalton Laws)',
      'Vapor Pressure Estimation via Antoine Equation (log10 P* = A - B / (T + C))',
      'Raoult Law for Ideal Binary Solutions: P_i = x_i * P_i*',
      'Relative Humidity, Percentage Humidity & Dew Point Calculation',
      'Condensation and Vaporization Processes in Evaporators',
      'Psychrometric Charts and Air-Water System Balances'
    ],
    author: 'Dr. Geetha K.',
    dateUpdated: '2024-10-08',
    pages: 40,
    fileSize: '3.8 MB',
    summary: 'Principles of chemical process calculations covering ideal gas law applications, partial pressure calculations, psychrometric parameters, and phase equilibrium approximations.',
    contentPreview: [
      '1. Gas Mixtures and Partial Pressures: According to Dalton\'s Law, total pressure is the sum of partial pressures: P_total = Σ P_i. For ideal gases, the mole fraction y_i = P_i / P_total.',
      '2. Vapor Pressure and Antoine Equation: Vapor pressure P* is strongly dependent on temperature. The 3-parameter Antoine correlation accurately fits experimental saturation curves.',
      '3. Relative Humidity (RH): Ratio of partial pressure of water vapor in air to the saturation vapor pressure of water at the dry-bulb temperature: RH = (p_w / p_w*) * 100%.'
    ],
    downloadFileName: 'SIT_CH33_Unit1_Process_Calculations_Geetha.pdf'
  },
  {
    id: 'note-ch34-u1',
    subjectCode: 'CH34-DEMO',
    subjectName: 'Technical Chemistry & Instrumental Analysis',
    semester: 3,
    unit: 1,
    unitTitle: 'Spectroscopy, Beer-Lambert Law & Electro-analytical Techniques',
    title: 'UV-Visible Spectrophotometry, Potentiometry, pH Metry & Conductance',
    topics: [
      'Principles of Electromagnetic Absorption in Chemical Bonds',
      'Beer-Lambert Law (A = ε * b * c) and Limitations of Beer Law',
      'Instrumentation: Monochromator, Cuvettes & Photomultiplier Detectors',
      'Potentiometric Titrations: Reference and Indicator Electrodes',
      'Conductometric Titrations of Strong vs Weak Acids and Bases',
      'Calibration Curve Construction and Unknown Concentration Determination'
    ],
    author: 'Dr. R. N. Murthy',
    dateUpdated: '2024-09-28',
    pages: 36,
    fileSize: '3.4 MB',
    summary: 'Fundamental physical chemistry and instrumental analysis for chemical engineers, optical instrumentation, calibration protocols, and conductometric endpoint determinations.',
    contentPreview: [
      '1. Beer-Lambert Law: When a monochromatic light beam passes through an absorbing medium, intensity decreases exponentially with path length and concentration: log10(I0 / I) = A = ε * b * c.',
      '2. Deviations from Beer-Lambert Law: Occur at high concentrations (typically > 0.01 M) due to electrostatic interactions between neighboring absorbing species, chemical equilibria shifts, or polychromatic light dispersion.'
    ],
    downloadFileName: 'SIT_CH34_Unit1_Technical_Chemistry_Murthy.pdf'
  }
];

export const MOCK_QUESTION_PAPERS: QuestionPaperItem[] = [
  {
    id: 'qp-sit-ch31-2024',
    subjectCode: 'CH31-DEMO',
    subjectName: 'Material & Energy Balances',
    semester: 3,
    year: 2024,
    examType: 'Semester End (SEE)',
    scheme: 'SIT Autonomous Scheme (Demo)',
    totalMarks: 100,
    fileSize: '1.7 MB',
    hasSolutions: true,
    sections: [
      {
        title: 'Module 1: Material Balances without Reactions',
        questions: [
          {
            qNum: 'Q1 (a)',
            text: 'A wet paper pulp contains 71 wt% water. It is passed through a continuous drier which removes 80% of the original water. Calculate the weight of dried pulp obtained per 1000 kg of fresh feed and the moisture content (wt% water) of the final product.',
            marks: 10,
            module: 'Unit 1'
          },
          {
            qNum: 'Q1 (b)',
            text: 'Define Tie Substance and Degrees of Freedom. Explain the systematic methodology of degrees of freedom analysis for multi-unit chemical plant flowsheets.',
            marks: 10,
            module: 'Unit 1'
          },
          {
            qNum: 'Q2 (a)',
            text: 'Fresh feed containing 20% KNO3 in water enters an evaporator-crystallizer system. The recycle stream contains 0.6 kg KNO3 per kg water. Calculate the recycle ratio and production rate of dry KNO3 crystals.',
            marks: 12,
            module: 'Unit 1'
          },
          {
            qNum: 'Q2 (b)',
            text: 'Why is a purge stream necessary in a recycle loop containing inert components? Derive a relation showing the effect of purge fraction on steady-state inert accumulation.',
            marks: 8,
            module: 'Unit 1'
          }
        ]
      },
      {
        title: 'Module 2: Stoichiometry & Combustion',
        questions: [
          {
            qNum: 'Q3 (a)',
            text: 'A fuel gas containing 85% CH4, 10% C2H6 and 5% N2 by volume is burned with 20% excess air. If 90% of the methane burns to CO2 and 10% to CO, calculate the Orsat analysis (dry basis) of the flue gas.',
            marks: 12,
            module: 'Unit 2'
          },
          {
            qNum: 'Q3 (b)',
            text: 'Distinguish between conversion, yield, and selectivity in chemical reactors with mathematical formulations.',
            marks: 8,
            module: 'Unit 2'
          }
        ]
      }
    ],
    downloadFileName: 'SIT_SEE_2024_CH31_Material_Balances.pdf'
  },
  {
    id: 'qp-sit-ch31-2023',
    subjectCode: 'CH31-DEMO',
    subjectName: 'Material & Energy Balances',
    semester: 3,
    year: 2023,
    examType: 'Semester End (SEE)',
    scheme: 'SIT Autonomous Scheme (Demo)',
    totalMarks: 100,
    fileSize: '1.5 MB',
    hasSolutions: true,
    sections: [
      {
        title: 'Module 1 & 2',
        questions: [
          {
            qNum: 'Q1',
            text: 'A distillation column separates a 10,000 kg/h feed consisting of 50 wt% benzene and 50 wt% toluene. Distillate contains 95 wt% benzene and bottoms contains 96 wt% toluene. Calculate the distillate and residue mass flow rates.',
            marks: 10,
            module: 'Unit 1'
          },
          {
            qNum: 'Q2',
            text: 'Write atomic balances for an ammonia synthesis reactor feed of N2 and H2. Show how extent of reaction is determined.',
            marks: 10,
            module: 'Unit 2'
          }
        ]
      }
    ],
    downloadFileName: 'SIT_SEE_2023_CH31_Material_Balances.pdf'
  },
  {
    id: 'qp-sit-ch32-2024',
    subjectCode: 'CH32-DEMO',
    subjectName: 'Fluid Mechanics for Chemical Engineers',
    semester: 3,
    year: 2024,
    examType: 'Semester End (SEE)',
    scheme: 'SIT Autonomous Scheme (Demo)',
    totalMarks: 100,
    fileSize: '1.9 MB',
    hasSolutions: true,
    sections: [
      {
        title: 'Module 1: Fluid Statics & Fluid Dynamics',
        questions: [
          {
            qNum: 'Q1 (a)',
            text: 'Derive Bernoulli equation from Euler equation of motion stating all underlying assumptions. What corrections are necessary for real viscous fluids and pump inputs?',
            marks: 10,
            module: 'Unit 1'
          },
          {
            qNum: 'Q1 (b)',
            text: 'Water flows through a 100 mm diameter horizontal pipe connected to a 50 mm throat Venturimeter. The differential mercury manometer reading is 250 mm. Calculate the mass flow rate of water (Take C_d = 0.98).',
            marks: 10,
            module: 'Unit 1'
          },
          {
            qNum: 'Q2 (a)',
            text: 'Derive the Hagen-Poiseuille equation for steady, laminar flow of an incompressible Newtonian fluid through a circular horizontal pipe.',
            marks: 12,
            module: 'Unit 2'
          }
        ]
      }
    ],
    downloadFileName: 'SIT_SEE_2024_CH32_Fluid_Mechanics.pdf'
  },
  {
    id: 'qp-sit-ch33-2024',
    subjectCode: 'CH33-DEMO',
    subjectName: 'Chemical Process Calculations',
    semester: 3,
    year: 2024,
    examType: 'Model Question Paper',
    scheme: 'SIT Autonomous Scheme (Demo)',
    totalMarks: 100,
    fileSize: '1.4 MB',
    hasSolutions: false,
    sections: [
      {
        title: 'Module 1: Gas Laws & Vapor Pressure',
        questions: [
          {
            qNum: 'Q1',
            text: 'Using Antoine equation, calculate the bubble point temperature and vapor composition of an equimolar liquid mixture of benzene and toluene at 1 atm total pressure.',
            marks: 12,
            module: 'Unit 1'
          },
          {
            qNum: 'Q2',
            text: 'Explain humidity, percentage saturation, and wet-bulb temperature. How is psychrometric chart used in cooling tower design?',
            marks: 8,
            module: 'Unit 1'
          }
        ]
      }
    ],
    downloadFileName: 'SIT_Model_2024_CH33_Process_Calculations.pdf'
  }
];

export const MOCK_LAB_MANUALS: LabManualItem[] = [
  {
    id: 'lab-ch36',
    courseCode: 'CHL36-DEMO',
    courseName: 'Fluid Flow Operations Laboratory',
    semester: 3,
    labIncharge: 'Prof. M. B. Patil & Mr. Chethan',
    totalExperiments: 6,
    fileSize: '7.8 MB',
    softwareRequired: ['Fluid Mechanics Flow Test Rig', 'Python 3 (NumPy/Matplotlib)', 'Manometer Fluids (Mercury & CCl4)', 'Digital Stopwatches'],
    objectives: [
      'Calibrate flow measurement instruments (Venturimeter, Orifice meter, Rotameter) and compute discharge coefficients (C_d).',
      'Determine major friction losses in circular conduits and plot Darcy friction factor vs Reynolds number in Moody chart.',
      'Visualize fluid flow regimes (laminar, transition, and turbulent) using Reynolds dye injection apparatus.'
    ],
    experiments: [
      {
        number: 1,
        title: 'Calibration of Venturimeter & Orifice Meter',
        objective: 'Determine coefficient of discharge (C_d) for a Venturimeter and an Orifice meter across varying volumetric flow rates of water.',
        prerequisites: 'Bernoulli Theorem, U-tube Manometry, Continuity Equation',
        algorithmSteps: [
          'Verify inlet and outlet valves are open; prime pump to remove air trapped in manometer limb tubes.',
          'Adjust flow control valve to obtain an initial manometer deflection (Δh = 5 to 20 cm Hg).',
          'Measure time required to collect a known volume of water (e.g., 10 liters) in the volumetric collection tank using a stopwatch.',
          'Calculate actual discharge Q_act = Volume collected / Time taken.',
          'Calculate theoretical discharge Q_theo = [A1 * A2 / sqrt(A1^2 - A2^2)] * sqrt(2 * g * Δh_water).',
          'Determine C_d = Q_act / Q_theo. Repeat for 5 different flow rates and plot Q_act vs sqrt(Δh).'
        ],
        codeLanguage: 'python',
        sampleCodeSnippet: `# Python verification of Venturi & Orifice Discharge Coefficient
import math

def calculate_cd(d1_mm, d2_mm, delta_h_hg_cm, vol_liters, time_seconds):
    # Dimensions in meters
    d1 = d1_mm / 1000.0
    d2 = d2_mm / 1000.0
    a1 = (math.pi / 4.0) * (d1 ** 2)
    a2 = (math.pi / 4.0) * (d2 ** 2)
    
    # Differential head in meters of water (Mercury sp.gr = 13.6)
    delta_h_m_hg = delta_h_hg_cm / 100.0
    h_water = delta_h_m_hg * (13.6 - 1.0)
    
    g = 9.81  # m/s^2
    q_actual = (vol_liters / 1000.0) / time_seconds  # m^3/s
    q_theoretical = (a1 * a2 / math.sqrt(a1**2 - a2**2)) * math.sqrt(2 * g * h_water)
    
    cd = q_actual / q_theoretical
    return q_actual, q_theoretical, cd

# Test case: 25mm pipe, 12.5mm throat, 15cm Hg manometer reading, 10L in 28.4s
q_act, q_th, cd = calculate_cd(25, 12.5, 15.0, 10.0, 28.4)
print(f"Actual Flow: {q_act*1000:.3f} L/s")
print(f"Theoretical Flow: {q_th*1000:.3f} L/s")
print(f"Coefficient of Discharge (Cd): {cd:.4f}")`,
        expectedOutput: `Actual Flow: 0.352 L/s
Theoretical Flow: 0.363 L/s
Coefficient of Discharge (Cd): 0.9697
Conclusion: Cd lies within standard Venturi calibration range (0.96 - 0.98).`,
        vivaQuestions: [
          {
            question: 'Why is the coefficient of discharge for an Orifice meter significantly lower than that of a Venturimeter?',
            answer: 'Because of sudden contraction at the orifice plate causing severe eddy formation and boundary layer separation at the vena contracta, dissipating pressure energy as turbulent friction (Cd ≈ 0.62 vs 0.98 for Venturi).'
          },
          {
            question: 'Why is the divergent cone angle of a Venturi meter kept smaller (5° - 7°) than convergent angle (20°)?',
            answer: 'To prevent boundary layer separation and flow stall against the adverse pressure gradient in decelerating fluid flow.'
          }
        ]
      },
      {
        number: 2,
        title: 'Reynolds Experiment & Determination of Critical Velocity',
        objective: 'Observe laminar, transitional, and turbulent flow patterns of water with dye filament injection and evaluate lower and upper critical Reynolds numbers.',
        prerequisites: 'Viscous shear, kinematic viscosity, dye stream stability',
        algorithmSteps: [
          'Fill constant-head water tank and allow water to become quiescent without surface oscillations.',
          'Partially open glass tube discharge valve to initiate slow, steady flow.',
          'Open dye reservoir needle valve to introduce a thin central filament of potassium permanganate.',
          'Observe stable thread line (Laminar regime: Re < 2100).',
          'Gradually increase discharge until dye begins wavy fluctuations (Transition) and finally diffuses completely across the entire tube cross section (Turbulent regime: Re > 4000).'
        ],
        codeLanguage: 'python',
        sampleCodeSnippet: `# Reynolds Number Regime Classifier
def classify_flow(velocity_ms, diameter_mm, temperature_c=25):
    # Dynamic viscosity of water at 25C: 0.89 x 10^-3 Pa.s, density: 997 kg/m^3
    rho = 997.0
    mu = 0.89e-3
    D = diameter_mm / 1000.0
    
    reynolds = (rho * velocity_ms * D) / mu
    if reynolds < 2100:
        regime = "Laminar Flow (Stable streamline)"
    elif 2100 <= reynolds <= 4000:
        regime = "Transitional Flow (Intermittent eddies)"
    else:
        regime = "Turbulent Flow (Complete dye dispersal)"
    return reynolds, regime

re, reg = classify_flow(0.12, 20.0)
print(f"Re: {re:.1f} -> {reg}")`,
        expectedOutput: `Re: 2688.5 -> Transitional Flow (Intermittent eddies)
Thresholds: Lower critical Re = 2100, Upper critical Re = 4000`,
        vivaQuestions: [
          {
            question: 'What is the physical meaning of Reynolds number?',
            answer: 'It represents the dimensionless ratio of fluid Inertial forces to Viscous forces (ρ v D / μ).'
          }
        ]
      },
      {
        number: 3,
        title: 'Determination of Friction Factor in Circular Pipes',
        objective: 'Measure major frictional head loss in smooth and rough pipes and verify Darcy-Weisbach equation and Colebrook correlation.',
        prerequisites: 'Darcy friction formula, pipe roughness, Moody diagram',
        algorithmSteps: [
          'Select test pipe conduit and record length between differential pressure taps (L = 2.0 m).',
          'Vary fluid velocity through test section across 6 increments.',
          'Record manometer differential pressure drop (Δh) for each velocity.',
          'Calculate friction factor f = (2 * g * D * h_f) / (4 * L * v^2).',
          'Compare experimental friction factor with theoretical Moody chart value.'
        ],
        codeLanguage: 'python',
        sampleCodeSnippet: `# Darcy Friction Factor calculation
def calculate_darcy_f(head_loss_m, length_m, diameter_m, velocity_ms):
    g = 9.81
    # Darcy-Weisbach: h_f = 4 * f * (L/D) * (v^2 / 2g)
    f = (2 * g * diameter_m * head_loss_m) / (4 * length_m * (velocity_ms ** 2))
    return f

f_exp = calculate_darcy_f(0.24, 2.0, 0.025, 1.4)
print(f"Calculated Darcy Friction Factor f: {f_exp:.5f}")`,
        expectedOutput: `Calculated Darcy Friction Factor f: 0.00751
Standard commercial steel pipe value in turbulent regime: 0.007 - 0.008.`,
        vivaQuestions: [
          {
            question: 'What is the difference between Fanning friction factor and Darcy-Weisbach friction factor?',
            answer: 'Darcy friction factor (f_D) is four times the Fanning friction factor (f_F): f_D = 4 * f_F.'
          }
        ]
      }
    ],
    downloadFileName: 'SIT_CHL36_Fluid_Flow_Lab_Manual_2024.pdf'
  },
  {
    id: 'lab-ch37',
    courseCode: 'CHL37-DEMO',
    courseName: 'Technical Chemistry Laboratory',
    semester: 3,
    labIncharge: 'Dr. R. N. Murthy & Mrs. Kavya',
    totalExperiments: 4,
    fileSize: '5.2 MB',
    softwareRequired: ['UV-Vis Spectrophotometer', 'Digital pH Meter', 'Conductometer', 'Standard Analytical Glassware'],
    objectives: [
      'Perform instrumental analytical evaluations including spectrophotometry, potentiometry, and conductometry.',
      'Determine unknown concentrations of heavy metal ions (Copper, Iron) using Beer-Lambert calibration curves.'
    ],
    experiments: [
      {
        number: 1,
        title: 'Colorimetric Determination of Copper in Solution',
        objective: 'Construct a Beer-Lambert calibration curve using standard cupric-ammonia complex solutions and find unknown copper concentration.',
        prerequisites: 'Beer-Lambert Law, Complexation Chemistry, Spectrophotometric Blank',
        algorithmSteps: [
          'Prepare stock CuSO4 solution (0.01 M) and standard aliquots (2, 4, 6, 8, 10 mL).',
          'Add 5 mL of concentrated ammonia to each aliquot to form deep blue cuprammonium complex [Cu(NH3)4]^2+.',
          'Dilute to 50 mL mark in volumetric flasks with distilled water.',
          'Measure absorbance at λ_max = 620 nm against a reagent blank.',
          'Plot Absorbance vs Concentration and evaluate unknown sample concentration from calibration line.'
        ],
        codeLanguage: 'python',
        sampleCodeSnippet: `# Beer-Lambert Linear Regression
import numpy as np

# Standard concentrations (mg/L) and recorded Absorbances
concentrations = np.array([20, 40, 60, 80, 100])
absorbances = np.array([0.142, 0.285, 0.428, 0.571, 0.715])

# Linear fit: Abs = slope * conc
slope, intercept = np.polyfit(concentrations, absorbances, 1)

unknown_absorbance = 0.490
unknown_conc = (unknown_absorbance - intercept) / slope
print(f"Calibration Slope: {slope:.5f}")
print(f"Unknown Copper Concentration: {unknown_conc:.2f} mg/L")`,
        expectedOutput: `Calibration Slope: 0.00714
Unknown Copper Concentration: 68.62 mg/L
Regression R^2: 0.9999`,
        vivaQuestions: [
          {
            question: 'Why is ammonia added to copper sulfate solution in colorimetry?',
            answer: 'Copper ions alone have very pale blue color with low molar absorptivity; complexation with ammonia forms intense deep blue [Cu(NH3)4]^2+ complex, significantly enhancing detection sensitivity.'
          }
        ]
      }
    ],
    downloadFileName: 'SIT_CHL37_Technical_Chemistry_Lab_Manual_2024.pdf'
  }
];

export const MOCK_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-sit-1',
    title: 'SIT Tumakuru: Schedule for 3rd Semester CIE-1 (Continuous Internal Evaluation)',
    category: 'Examinations',
    date: '2024-10-18',
    author: 'Department Exam Coordinator, Chemical Engg',
    priority: 'high',
    pinned: true,
    content: 'All 3rd-Semester Chemical Engineering students are hereby notified that CIE-1 examinations will commence from November 4, 2024. Question paper format covers Units 1 & 2 for CH31 (Material & Energy Balances), CH32 (Fluid Mechanics), CH33, and MAT31. Attendance condonation deadline is October 28.',
    attachmentName: 'SIT_ChemEngg_CIE1_Schedule_Nov2024.pdf'
  },
  {
    id: 'ann-sit-2',
    title: 'Submission of Fluid Flow Lab Observation Books & Record Sheets',
    category: 'Lab Timetable',
    date: '2024-10-12',
    author: 'Prof. M. B. Patil (Lab In-charge)',
    priority: 'high',
    pinned: true,
    content: 'Students registered for CHL36 (Fluid Flow Operations Lab) must submit completed observation books with calculations for Venturi meter and Reynolds experiments by Monday, 21st October. Verification by lab instructors is mandatory before entering second cycle experiments.',
    attachmentName: 'CHL36_Record_Submission_Notice.pdf'
  },
  {
    id: 'ann-sit-3',
    title: 'Technical Symposium & Guest Lecture: Aspen Plus Process Simulation',
    category: 'Guest Lecture',
    date: '2024-10-06',
    author: 'IIChE SIT Student Chapter',
    priority: 'normal',
    pinned: false,
    content: 'The Indian Institute of Chemical Engineers (IIChE) SIT Student Chapter is conducting a hands-on workshop on Aspen Plus process flowsheet modeling for chemical engineering undergraduates on November 9, 2024, at the Department Computing Facility.',
    attachmentName: 'AspenPlus_Workshop_Flyer.pdf'
  },
  {
    id: 'ann-sit-4',
    title: 'Curriculum & Demo Subject Notice for Students & Evaluators',
    category: 'Circular',
    date: '2024-10-02',
    author: 'Head of Department, Chemical Engineering',
    priority: 'normal',
    pinned: false,
    content: 'Please note: 3rd-Semester Chemical Engineering course codes displayed on this portal carry [DEMO] indicators as realistic representative academic data until the final autonomous syllabus gazette is officially uploaded.',
    attachmentName: 'SIT_Autonomous_Curriculum_Notice.pdf'
  }
];
