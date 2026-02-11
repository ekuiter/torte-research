# Source Code of SAT Solvers

This directory contains source code of SAT solvers for archival purposes.

`dimacs_solver_source_lines_of_code.csv` contains an analysis of the SLOC statistics of various solvers.

These statistics were obtained with:

```
cloc .; cloc .  | grep ^C | tr -s ' ' | rev | cut -d' ' -f 1 | rev | awk '{n += $1}; END{print n}'
```

on the patched source code of the SAT museum (excluding tests).

`source_lines_of_code_extended` considers additional source code of preprocessors like SatELite if they have been distributed together with the solver.

For two solvers (abcdsat-2015, berkmin-2003), we only have binaries, and no knowledge about the lines of code.