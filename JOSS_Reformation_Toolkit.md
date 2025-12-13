# JOSS Submission Reformation Toolkit
## Practical Checklists, Templates, and Examples

---

## QUICK START: 3-WEEK REFORMATION ROADMAP

### **Week 1: Repository Preparation**

#### Day 1-2: Choose Your Strongest Submission
**Decision Matrix:**
| Submission | Algorithm Novelty | Generalizability | Research Audience | Priority |
|------------|-------------------|------------------|-------------------|----------|
| WMS-OptLab | HIGH (AQPSO-BV) | HIGH | Operations Research | **#1** |
| ERP-ProcessMiner | MEDIUM | MEDIUM | Process Mining | **#2** |
| SME-ERPSim | MEDIUM | HIGH | Complex Systems | #3 |
| DIM-Weight-ERP | HIGH (PoDQ) | MEDIUM | Digital Twins | #4 |

**Decision:** Start with **WMS-OptLab → HybridOptKit**

#### Day 3-4: Extract Core Research Contribution
```
❌ REJECT: "Optimization for warehouse operations"
✅ ACCEPT: "Novel hybrid metaheuristic combining quantum-inspired PSO with binary variables"

Core Research Questions Your Software Answers:
1. How do hybrid metaheuristics perform on constrained optimization?
2. What are the convergence properties of AQPSO-BV?
3. How does algorithm performance vary across problem classes?
```

#### Day 5-7: Refactor Repository Structure
**Current Structure (ERP-focused):**
```
WMS-OptLab/
├── erp_connector.py      # ❌ Remove
├── warehouse_module.py   # ❌ Make optional example
├── optimization.py       # ✅ Extract to core
└── README.md             # ❌ Business-focused
```

**Reformed Structure (Research-focused):**
```
HybridOptKit/
├── README.md                # ✅ Research overview
├── LICENSE                  # MIT or Apache 2.0
├── setup.py
├── requirements.txt
├── requirements-dev.txt     # Testing dependencies
├── src/
│   └── hybridoptkit/
│       ├── __init__.py
│       ├── algorithms/
│       │   ├── __init__.py
│       │   ├── aqpso.py           # Your novel algorithm
│       │   ├── binary_varz.py
│       │   └── hybrid_meta.py
│       ├── problems/
│       │   ├── __init__.py
│       │   ├── benchmark.py       # Standard test functions
│       │   └── constrained.py
│       ├── utils/
│       │   ├── __init__.py
│       │   ├── visualization.py
│       │   └── metrics.py
│       └── examples/           # Domain applications
│           ├── __init__.py
│           ├── logistics.py    # Optional: warehouse example
│           ├── portfolio.py
│           └── scheduling.py
├── tests/
│   ├── __init__.py
│   ├── test_algorithms.py
│   ├── test_benchmark.py
│   └── test_convergence.py
├── docs/
│   ├── conf.py
│   ├── index.rst
│   ├── installation.rst
│   ├── quickstart.rst
│   ├── api.rst
│   ├── tutorials/
│   │   ├── 01_basic_optimization.ipynb
│   │   ├── 02_custom_problems.ipynb
│   │   └── 03_benchmarking.ipynb
│   └── research/
│       ├── algorithm_details.md
│       └── convergence_analysis.md
├── benchmarks/
│   ├── run_benchmarks.py
│   ├── results/
│   └── README.md
├── paper/
│   ├── paper.md
│   ├── paper.bib
│   └── figures/
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── CITATION.cff
└── .github/
    └── workflows/
        ├── tests.yml
        ├── docs.yml
        └── publish.yml
```

---

### **Week 2: Implementation & Documentation**

#### Checklist: Core Software Requirements

**✅ Installation & Dependencies**
- [ ] `pip install hybridoptkit` works
- [ ] All dependencies pinned in requirements.txt
- [ ] No proprietary dependencies
- [ ] Installation documented in README and docs/installation.rst
- [ ] Tested on clean virtual environment

**✅ Testing**
- [ ] pytest suite with >70% code coverage
- [ ] Tests for all public API functions
- [ ] Benchmark tests comparing to baseline algorithms
- [ ] CI/CD pipeline (GitHub Actions) passing
- [ ] Tests run automatically on commits

**✅ Documentation**
- [ ] README.md with clear research focus
- [ ] Sphinx documentation hosted on ReadTheDocs
- [ ] API reference for all public functions
- [ ] At least 3 tutorial notebooks
- [ ] Installation instructions tested by independent user
- [ ] Examples solve real problems (not toy cases)

**✅ Research Artifacts**
- [ ] Benchmark results comparing your method to baselines
- [ ] Jupyter notebooks with reproducible experiments
- [ ] Convergence plots and performance metrics
- [ ] Mathematical formulation documented

---

### **Week 3: JOSS Paper Writing**

#### Template: Reformed JOSS Paper

```markdown
---
title: 'HybridOptKit: A Python Library for Hybrid Metaheuristic Optimization with Binary and Continuous Variables'
tags:
  - Python
  - optimization
  - metaheuristics
  - quantum-inspired computing
  - operations research
authors:
  - name: [Your Name]
    orcid: [Your ORCID]
    affiliation: 1
  - name: [Coauthor Name]
    orcid: [Their ORCID]
    affiliation: 1
affiliations:
  - name: [Your Institution]
    index: 1
date: [Date]
bibliography: paper.bib
---

# Summary

HybridOptKit is a Python library for solving constrained optimization 
problems using hybrid metaheuristic algorithms that seamlessly handle 
mixed binary-continuous variable spaces. The package implements novel 
variants including Adaptive Quantum-inspired Particle Swarm Optimization 
with Binary Variables (AQPSO-BV), alongside classical metaheuristics for 
benchmarking and comparison.

The library addresses the research need for flexible, well-tested 
implementations of hybrid optimization methods. While existing packages 
like PyGMO [@pygmo] and DEAP [@deap] provide genetic algorithms and 
swarm intelligence, they lack integrated support for quantum-inspired 
operators in mixed-variable spaces. HybridOptKit fills this gap by 
providing a unified API for researchers to experiment with, benchmark, 
and extend hybrid metaheuristics.

# Statement of Need

Constrained optimization with mixed variable types remains challenging 
in operations research, computational intelligence, and applied 
mathematics [@Smith2023; @Johnson2022]. Researchers require software 
tools that:

1. **Enable algorithm comparison**: Standardized interfaces for testing 
   novel metaheuristics against established baselines
2. **Support mixed variable spaces**: Seamless handling of binary, integer, 
   and continuous decision variables
3. **Provide reproducibility**: Deterministic seeding and comprehensive 
   logging for academic publications
4. **Facilitate extension**: Modular design enabling researchers to 
   implement custom operators and algorithms

Existing Python optimization libraries have limitations:

- **SciPy** [@scipy]: Limited to gradient-based and simple global methods, 
  no metaheuristics
- **DEAP** [@deap]: Strong genetic algorithms but requires significant 
  boilerplate for PSO and hybrid methods
- **PyGMO** [@pygmo]: C++-based with Python bindings, difficult to extend 
  with custom operators
- **pymoo** [@pymoo]: Excellent multi-objective support but limited 
  quantum-inspired and hybrid operators

HybridOptKit provides a Pythonic, extensible framework specifically 
designed for operations research scholars investigating hybrid 
metaheuristic behaviors. The package includes comprehensive benchmarking 
utilities comparing algorithm performance across standard test suites 
(CEC-2017, Black-Box Optimization Benchmarks) and provides statistical 
analysis tools following best practices [@Hansen2016].

**Target Audience:** Operations research scholars, computational intelligence 
researchers, applied mathematicians studying optimization, PhD students 
developing novel metaheuristics.

# Key Features

- **Novel Algorithms**: AQPSO-BV with adaptive quantum gate rotation
- **Standard Baselines**: PSO, GA, DE implementations for comparison
- **Benchmark Suite**: 50+ test functions (CEC-2017, BBOB)
- **Visualization**: Convergence plots, trajectory analysis, population dynamics
- **Statistical Tools**: Wilcoxon rank-sum tests, effect size computation
- **Reproducibility**: Deterministic seeding, comprehensive logging

# Research Applications

HybridOptKit has been used in:

- PhD thesis research at [University] investigating convergence properties 
  of quantum-inspired metaheuristics [@Student2024]
- Comparative study of hybrid algorithms for combinatorial optimization 
  [@Collaborator2024]
- Benchmarking experiments for IEEE Congress on Evolutionary Computation 
  (CEC 2025) special session

# Example Usage

```python
from hybridoptkit import AQPSO, Problem, BenchmarkSuite

# Define optimization problem
problem = Problem(
    objective=lambda x: sum(x**2),  # Sphere function
    bounds=[(-5, 5)] * 10,           # 10 dimensions
    constraints=[]
)

# Initialize optimizer
optimizer = AQPSO(
    n_particles=50,
    max_iterations=1000,
    quantum_rotation=True
)

# Run optimization
result = optimizer.optimize(problem, seed=42)

# Benchmark against baselines
suite = BenchmarkSuite(['PSO', 'GA', 'DE', 'AQPSO'])
comparison = suite.run(problem, n_trials=30)
comparison.plot_convergence()
comparison.statistical_test()  # Wilcoxon signed-rank
```

# Comparison to Related Software

| Feature | HybridOptKit | DEAP | PyGMO | pymoo |
|---------|--------------|------|-------|-------|
| Quantum-inspired PSO | ✓ | ✗ | ✗ | ✗ |
| Mixed variables | ✓ | Partial | ✓ | ✓ |
| Statistical testing | ✓ | ✗ | ✗ | Limited |
| Pure Python | ✓ | ✓ | ✗ | ✓ |
| Research-focused API | ✓ | ✗ | ✗ | ✓ |

# Documentation

Comprehensive documentation including API reference, tutorials, and 
algorithm theory is available at https://hybridoptkit.readthedocs.io. 
The repository includes Jupyter notebooks demonstrating:

1. Basic optimization workflow
2. Implementing custom problems and constraints
3. Benchmarking and statistical comparison
4. Extending with custom operators

# Acknowledgements

This research was supported by [Grant Information]. We thank [Collaborators] 
for valuable feedback and testing.

# References
```

#### Bibliography Template (paper.bib)

```bibtex
@article{Smith2023,
  title={Advances in hybrid metaheuristics for constrained optimization},
  author={Smith, J and Doe, A},
  journal={Operations Research Letters},
  volume={51},
  number={3},
  pages={234--249},
  year={2023},
  doi={10.1016/j.orl.2023.xxxxx}
}

@inproceedings{Johnson2022,
  title={Quantum-inspired optimization: A survey},
  author={Johnson, M},
  booktitle={IEEE Congress on Evolutionary Computation},
  pages={1--8},
  year={2022},
  doi={10.1109/CEC.2022.xxxxx}
}

@article{scipy,
  title={SciPy 1.0: fundamental algorithms for scientific computing in Python},
  author={Virtanen, Pauli and Gommers, Ralf and others},
  journal={Nature Methods},
  volume={17},
  number={3},
  pages={261--272},
  year={2020},
  doi={10.1038/s41592-019-0686-2}
}

@article{deap,
  title={DEAP: Evolutionary algorithms made easy},
  author={Fortin, Félix-Antoine and others},
  journal={Journal of Machine Learning Research},
  volume={13},
  number={70},
  pages={2171--2175},
  year={2012}
}

@article{pygmo,
  title={A parallel global multiobjective framework for optimization},
  author={Biscani, Francesco and Izzo, Dario},
  journal={IEEE Transactions on Evolutionary Computation},
  volume={24},
  number={3},
  pages={408--423},
  year={2019},
  doi={10.1109/TEVC.2019.2942204}
}

@inproceedings{pymoo,
  title={pymoo: Multi-objective optimization in Python},
  author={Blank, Julian and Deb, Kalyanmoy},
  booktitle={IEEE Access},
  volume={8},
  pages={89497--89509},
  year={2020},
  doi={10.1109/ACCESS.2020.2990567}
}

@article{Hansen2016,
  title={COCO: A platform for comparing continuous optimizers in a black-box setting},
  author={Hansen, Nikolaus and others},
  journal={arXiv preprint arXiv:1603.08785},
  year={2016}
}
```

---

## README.md Template (Research-Focused)

```markdown
# HybridOptKit

[![Tests](https://github.com/username/hybridoptkit/workflows/tests/badge.svg)](https://github.com/username/hybridoptkit/actions)
[![Documentation](https://readthedocs.org/projects/hybridoptkit/badge/)](https://hybridoptkit.readthedocs.io)
[![PyPI](https://img.shields.io/pypi/v/hybridoptkit)](https://pypi.org/project/hybridoptkit/)
[![License](https://img.shields.io/github/license/username/hybridoptkit)](LICENSE)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.XXXXX.svg)](https://doi.org/10.5281/zenodo.XXXXX)

A Python library for hybrid metaheuristic optimization with binary and 
continuous variables, designed for operations research and computational 
intelligence research.

## Research Focus

HybridOptKit implements novel quantum-inspired metaheuristics and provides 
a unified framework for benchmarking and comparing optimization algorithms. 
The library is designed for researchers investigating:

- Convergence properties of hybrid metaheuristics
- Performance comparison across algorithm classes
- Mixed-variable constrained optimization
- Quantum-inspired computing for optimization

## Key Features

- **Novel Algorithms**: AQPSO-BV (Adaptive Quantum PSO with Binary Variables)
- **Standard Baselines**: PSO, GA, DE for comparison
- **Benchmark Suite**: CEC-2017, BBOB test functions
- **Statistical Analysis**: Wilcoxon tests, effect sizes
- **Reproducibility**: Deterministic seeding, logging

## Installation

```bash
pip install hybridoptkit
```

For development:
```bash
git clone https://github.com/username/hybridoptkit
cd hybridoptkit
pip install -e ".[dev]"
```

## Quick Start

```python
from hybridoptkit import AQPSO, Problem

# Define problem
problem = Problem(
    objective=lambda x: sum(x**2),
    bounds=[(-5, 5)] * 10,
    constraints=[]
)

# Optimize
optimizer = AQPSO(n_particles=50, max_iterations=1000)
result = optimizer.optimize(problem, seed=42)

print(f"Best solution: {result.x}")
print(f"Best value: {result.f}")
```

## Documentation

Full documentation: https://hybridoptkit.readthedocs.io

Tutorials:
- [Basic Optimization](docs/tutorials/01_basic_optimization.ipynb)
- [Custom Problems](docs/tutorials/02_custom_problems.ipynb)
- [Benchmarking](docs/tutorials/03_benchmarking.ipynb)

## Research Applications

HybridOptKit has been used in:

- PhD thesis: "Convergence Analysis of Quantum-Inspired Metaheuristics" 
  (University, 2024)
- IEEE CEC 2025 Special Session on Hybrid Algorithms
- Comparative study: "Performance of Metaheuristics on Constrained Problems" 
  (Journal, 2024)

## Citation

If you use HybridOptKit in your research, please cite:

```bibtex
@article{HybridOptKit2024,
  title={HybridOptKit: A Python Library for Hybrid Metaheuristic Optimization},
  author={Your Name and Coauthors},
  journal={Journal of Open Source Software},
  year={2024},
  doi={10.21105/joss.xxxxx}
}
```

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgements

Supported by [Grant/Institution]. Thanks to [Collaborators] for feedback.
```

---

## CONTRIBUTING.md Template

```markdown
# Contributing to HybridOptKit

Thank you for considering contributing to HybridOptKit! We welcome:

- Bug reports and fixes
- New algorithms and operators
- Improved documentation
- Benchmark functions
- Performance optimizations

## Development Setup

```bash
git clone https://github.com/username/hybridoptkit
cd hybridoptkit
pip install -e ".[dev]"
```

## Running Tests

```bash
pytest tests/
pytest --cov=hybridoptkit tests/  # With coverage
```

## Code Style

We follow PEP 8. Run:
```bash
black src/
flake8 src/
```

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/algorithm-xyz`)
3. Write tests for new functionality
4. Ensure all tests pass
5. Update documentation
6. Submit pull request

## Adding New Algorithms

New algorithms should:
- Inherit from `BaseOptimizer`
- Include docstrings with mathematical formulation
- Have unit tests
- Include benchmark comparison
- Be documented in API reference

See `src/hybridoptkit/algorithms/template.py` for structure.

## Questions?

Open an issue or contact [email].
```

---

## CODE_OF_CONDUCT.md Template

```markdown
# Contributor Covenant Code of Conduct

## Our Pledge

We as members, contributors, and leaders pledge to make participation in our
community a harassment-free experience for everyone, regardless of age, body
size, visible or invisible disability, ethnicity, sex characteristics, gender
identity and expression, level of experience, education, socio-economic status,
nationality, personal appearance, race, caste, color, religion, or sexual
identity and orientation.

## Our Standards

Examples of behavior that contributes to a positive environment:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

## Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported to the community leaders responsible for enforcement at
[email]. All complaints will be reviewed and investigated promptly and fairly.

## Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage],
version 2.1, available at
[https://www.contributor-covenant.org/version/2/1/code_of_conduct.html][v2.1].

[homepage]: https://www.contributor-covenant.org
[v2.1]: https://www.contributor-covenant.org/version/2/1/code_of_conduct.html
```

---

## Pre-Submission Checklist

**Before submitting to JOSS, verify ALL of these:**

### Repository Checklist
- [ ] Repository is public on GitHub/GitLab
- [ ] OSI-approved license (MIT, Apache, GPL, BSD)
- [ ] README.md with research focus (not business focus)
- [ ] Installation works via `pip install` or conda
- [ ] All dependencies are open-source
- [ ] No authentication required to clone repository

### Code Quality Checklist
- [ ] >70% test coverage (verify with `pytest --cov`)
- [ ] All tests pass in CI/CD
- [ ] No flake8/pylint critical warnings
- [ ] Functions have docstrings
- [ ] Example code runs successfully

### Documentation Checklist
- [ ] Sphinx documentation builds successfully
- [ ] API reference complete
- [ ] At least 3 tutorial notebooks
- [ ] Installation instructions tested by independent person
- [ ] README targets researchers, not businesses

### Paper Checklist
- [ ] 250-1000 words
- [ ] Written in Markdown (paper.md)
- [ ] YAML header with tags, authors, affiliations
- [ ] Bibliography file (paper.bib) with DOIs
- [ ] "Statement of Need" section
- [ ] "Summary" section
- [ ] Cites related academic software
- [ ] Targets research audience
- [ ] No business/commercial framing
- [ ] Compiles to PDF using JOSS template

### Final Checks
- [ ] Tagged release on GitHub (e.g., v1.0.0)
- [ ] Archived on Zenodo with DOI
- [ ] All coauthors agree to submission
- [ ] CITATION.cff file present
- [ ] No broken links in documentation
- [ ] Example code in paper/README runs correctly

---

## Red Flags Checklist

**If ANY of these apply, JOSS will likely desk-reject:**

- [ ] ❌ Title mentions "ERP", "Enterprise", "SME", "Business"
- [ ] ❌ README targets business users, not researchers
- [ ] ❌ No comparison to existing research tools
- [ ] ❌ "Statement of Need" focuses on industry problems
- [ ] ❌ No academic citations in bibliography
- [ ] ❌ Tests are trivial (e.g., `assert True`)
- [ ] ❌ <50% code coverage
- [ ] ❌ Documentation is only installation instructions
- [ ] ❌ No example usage for research problems
- [ ] ❌ Repository is mostly configuration/boilerplate
- [ ] ❌ Depends on proprietary software
- [ ] ❌ Paper mentions commercial applications prominently

---

## Timeline Estimation

**Realistic Timeline for First Submission:**

| Task | Time Required | Dependencies |
|------|---------------|--------------|
| Choose submission | 1 day | - |
| Refactor repository | 5-7 days | Choice made |
| Write tests | 3-4 days | Refactoring complete |
| Setup CI/CD | 1 day | Tests written |
| Write documentation | 5-7 days | Refactoring complete |
| Create tutorials | 3-4 days | Documentation started |
| Write JOSS paper | 2-3 days | Documentation complete |
| Pre-submission review | 2 days | Paper written |
| Archive to Zenodo | 1 day | Tagged release |
| **TOTAL** | **~3-4 weeks** | - |

**After Submission:**
- JOSS pre-review: 1-2 weeks
- Editor assignment: 1 week
- Reviewer recruitment: 2-3 weeks
- Review process: 4-8 weeks
- Revisions: 2-4 weeks
- Acceptance: 1 week

**Total from submission to acceptance: 3-5 months (typical)**

---

**END OF REFORMATION TOOLKIT**
