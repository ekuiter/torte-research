# Evolution and Divergence of Kconfig in Open-Source Projects

This repository contains the raw data and analysis supporting the thesis:

> **Evolution and Divergence of Kconfig in Open-Source Projects:  
> A Study on Parser Compatibility and Interoperability**

Inside you’ll find:

- **data/kconfig_commits.csv** – a table of all commits that modify the core Kconfig parser files (`lexer.l`, `parser.y`, `menu.c`, `expr.c`, `symbol.c`), classified by type of change.
- A brief description of each change class in the CSV header.
- (Future) scripts or notebooks to reproduce figures and statistics.

### How to use

1. Clone this repo:
   ```bash
   git clone git@github.com:ekuiter/torte-research.git
   cd torte-research

