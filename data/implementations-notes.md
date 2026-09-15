##### Notes

- With LKC (Linux Kernel Configurator or [LinuxKernelConf](https://web.archive.org/web/20240520124222/https://zippel.home.xs4all.nl/lc/)), we always refer to the canonical reference implementation of KConfig in the Linux kernel.
  We do this to keep a clear distinction between the language (KConfig) and its implementation (LKC).
  The abbreviation has been introduced early (evidence for [2008](https://www.isa.us.es/aspl08/?download=W5_P11_Sincero_The_Linux_Kernel_Configurator_as_a_Feature_Modeling_Tool.pdf) and [2002](https://web.archive.org/web/20160318211355/http://zippel.home.xs4all.nl/lc/old/)).
- [Karakaya25](https://elias-kuiter.de/publications/#Karakaya25) includes an in-depth analysis of the evolution of LKC's core components (i.e., `menu.c`, `expr.c`, `symbol.c`, `parser.y`, `lexer.l`) over 365 commits in the Linux kernel:
  <div class="kconfig-note-figures kconfig-commit-figures">
    <img src="data/kconfig-commit-distribution.png" alt="Distribution of commits across core Kconfig parser files over time">
    <img src="data/kconfig-commit-classification.png" alt="Yearly distribution of commit classifications in the Kconfig parser">
  </div>
  <p>The full dataset is available as a <a href="kconfig-commits.csv">CSV</a> file, and described and discussed in <a href="https://elias-kuiter.de/publications/#Karakaya25">Karakaya25</a>.</p>
