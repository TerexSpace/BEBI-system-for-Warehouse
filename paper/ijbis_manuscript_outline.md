Title: Blockchain-Enabled Business Information System for Multi-Party Warehouse Operations: A Design Science Approach to Trust, Transparency, and Operational Efficiency

Abstract (draft, 223 words):
Multi-party warehouse operations depend on dimensional weight tariffs that clients must trust but rarely verify, creating billing disputes, rework, and strained 3PL–client relationships. This paper presents a design-science artefact—a blockchain-governed business information system (BIS) that integrates Hyperledger Fabric smart contracts, an XGBoost-based dimensional weight predictor, and a digital-twin analytics layer—to improve transparency and accountability in tariff management. The system immutably records measurements, versions tariff policies, automates tariff calculation, and orchestrates dispute workflows. We validate the prototype through seeded, reproducible synthetic scenarios and expert review with logistics practitioners, demonstrating reductions in dispute handling time, clearer policy traceability, and higher perceived trust in billing outcomes. Quantitative results show deterministic KPI improvements across latency, throughput, and dispute rate scenarios, while qualitative feedback highlights governance and adoption considerations for consortium-based warehouse networks. The contribution is threefold: (1) a design framework for blockchain-enabled BIS that targets trust deficits in warehouse tariffing; (2) an integrated prototype linking ERP-facing APIs, ML-based measurement validation, and consortium governance; and (3) empirically grounded insights on how distributed ledgers and automation reshape transaction costs and trust in 3PL ecosystems. The work offers practitioners a reproducible blueprint for consortium formation and rollout, and provides researchers with a seeded, open-source baseline for studying blockchain governance in warehouse information systems.

Keywords: business information systems; blockchain technology; warehouse management; multi-party collaboration; supply chain trust; digital twins; machine learning; dispute resolution

Planned figures:
- Multi-layer system architecture (business interface, application logic, blockchain governance, data layers)
- Consortium topology and governance roles (operators, clients, auditors)
- Smart-contract interaction flow for measurement → tariff → dispute
- Scenario comparison table (traditional vs blockchain-enabled)
- KPI plots from seeded synthetic scenarios (labeled as synthetic, reproducible)

Section plan (aligned to IJBIS focus):
- Introduction: business problem framing, trust deficits, research questions
- Literature & theory: IOIS, trust/TCE, blockchain in supply chains, ML in warehouse ops, digital twins
- Design principles: immutability, transparency, automation, distributed governance, integration
- System design: requirements, architecture, governance model
- Implementation: stack rationale, core components, integration pathways
- Validation: seeded synthetic scenarios (method, metrics), expert evaluation, limitations of synthetic data
- Discussion: theoretical contributions, managerial implications, adoption/gov challenges
- Conclusion & future work: roadmap to real-world pilots, integration with IoT sensing

Highlights (for submission):
- Blockchain-governed BIS that addresses trust deficits in dimensional weight tariffing across 3PL–client networks.
- Integration of distributed ledger, ML-based dimensional weight prediction, and digital-twin analytics for transparent billing and dispute workflows.
- Reproducible, seeded synthetic scenarios and expert feedback demonstrate reduced dispute effort and clearer tariff traceability.
- Governance blueprint for warehouse consortia covering policy versioning, auditability, and role-based participation.
