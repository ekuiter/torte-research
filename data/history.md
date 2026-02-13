### History of KConfig {#history}

Here, we summarize the history of this project and notable developments in its scope, such as KConfig.

**2002**
- **October**: [Linux v2.5.45](https://lwn.net/Articles/14197/) introduces [KConfig](#languages), the successor of CML1 for specifying Linux's features and their dependencies.
  KConfig and its implementation, the [Linux kernel configurator](#implementations) (LKC), was developed by Roman Zippel.

**2010**
- **October**: [Vegard Nossum](https://github.com/vegard) (still an active KConfig developer in 2025) [proposes](https://lkml.org/lkml/2010/5/17/164) the first known [integration of a SAT solver](https://github.com/vegard/linux-2.6-archive/blob/kconfig-sat/scripts/kconfig/satconf.c) into KConfig as part of a *Google Summer of Code* project.
  While this [initial pitch](https://groups.google.com/g/linux.kernel/c/FgujvYD3AG4/m/bKM_FHyfo1QJ) was received well, the idea was [not discussed further](https://groups.google.com/g/linux.kernel/search?q=Vegard%20Nossum%20SAT) until 2015.

**2015**
- **October**: Kernel developers (Luis R. Rodriguez) and researchers from both software engineering (Thorsten Berger, Valentin Rothberg) and automated reasoning (Armin Biere, Mate Soos, Andrzej Wąsowski) [team up](https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI) and [discuss](https://groups.google.com/g/kconfig-sat/) how to [integrate a SAT solver](https://kernelnewbies.org/KernelProjects/kconfig-sat) into KConfig.
  The topic is [being discussed](https://groups.google.com/g/linux.kernel/search?q=KConfig%20SAT%20solver) and [documented in the kernel](https://github.com/torvalds/linux/commit/1c199f2878f6c1b8c52125ad9805e94fe2dde472).
  However, the proposal is not taken to the next stage until the [proposal](https://ieeexplore.ieee.org/document/9401969) of [ConfigFix](#extractors) in 2021, which is largely inspired by [this discussion thread](https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI).
  
  The [undertaker](#extractors) extractor [is considered](https://groups.google.com/g/linux.kernel/c/8Ykzn-L_eYI/m/S9cBjBntCQAJ), but "it was determined that this code could not be merged upstream for a variety of reasons, but mostly due to the fact that it was R&D work and it was under GPLv3".
  LWN editor Jonathan Corbet [discusses](https://lwn.net/Articles/617383/) additional reasons for this decision, citing Junghwan Kang that "[undertaker-tailor] doesn't work and needs an overhaul".
  Luis R. Rodriguez argues that undertaker's [PicoSAT](https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI/m/6H7q9xksCwAJ) (which supports MUS, among others, and which [inspired](https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI/m/5YdKwddqBgAJ) the now-standard IPASIR solver interface) is a good candidate solver for such an integration, should it be attempted.
  Luis also [notes that](https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI/m/1s_uuptRDAAJ) "Vegard's work dates back to 2011 and [over time SAT solvers have gotten much better](https://elias-kuiter.de/publications/#KBT+:ICSE26)".
  
  Vegard Nossum also [follows up](https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI/m/E1hHH5pWDAAJ) on their SAT integration, stating that there are "a lot of problems with finding the right encoding/formalisation of the kconfig language. It's simply not very well documented (the code is the only standard) and there are a lot of weird corner cases with hidden prompts, choice values, prompt dependencies, symbol dependencies, default values, conditional default values, you name it" (see [Experiences](#experiences)).
  One issue [discussed](https://lkml.org/lkml/2010/5/17/172) [repeatedly](https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI/m/Ld2wKTtSDAAJ) is explainability of solver results, which would require clause-constraint traceability and [MUS](https://en.wikipedia.org/wiki/Unsatisfiable_core) support in the solver.
  Other discussed challenges include the handling of [non-Boolean features](https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI/m/E1hHH5pWDAAJ) (notably, [tristate](https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI/m/n71Nh1WmBQAJ) features) and [constraints](https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI/m/yPZsCWWnBQAJ), [solver interfaces](https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI/m/5YdKwddqBgAJ), [SAT](https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI/m/5YdKwddqBgAJ) vs. [SMT](https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI/m/zrRbr1JjBgAJ) solvers, and [inaccuracies](https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI/m/1u5OcGMdCwAJ) in [existing translations](https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI/m/vn3j0xWCAAAJ).
  Valentin Rothberg [states that](https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI/m/KMa6_EGoBQAJ), beyond technical challenges, integration of a SAT solver remains difficult because the community needs "something that is easy to use, is easy to maintain, doesn't consume much time, (and most importantly) doesn't disturb the dinosaurs' working environment".

**2017**
- **June**: Linus Torvalds [expresses his skepticism](https://yhbt.net/lore/ksummit-discuss/CA+55aFyvssxg63UoQ-rOaf1TMacJ6T5jyLkWECosQJ_N=9gaaQ@mail.gmail.com/#t) towards a [SAT integration](https://kernelnewbies.org/KernelProjects/kconfig-sat) into LKC: "The SAT solver will only hurt, because it will bring in all those irrelevant people who are interested in SAT solving, not in making things easy for users."
- **September**: [Ulf Magnusson](https://github.com/ulfalizer) releases version 1.0.0 of [KConfigLib](#implementations), a standalone reimplementation of a KConfig parser in Python (alternative to LKC), which will be adopted by several projects over the following years.

**2018**
- **May**: We release [kmax-vm](https://github.com/ekuiter/kmax-vm), an [early predecessor](https://github.com/ekuiter/torte?tab=readme-ov-file#history) of torte that automates feature-model extraction with [KClause](#extractors) in a virtual machine.

**2021**
- **May**: A [joint team](https://github.com/isselab/configfix?tab=readme-ov-file#credits) of developers [proposes](https://ieeexplore.ieee.org/document/9401969) ConfigFix, a [feature-model formula extractor](#extractors) for KConfig that was inspired by [Vegard Nossum's work](https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI/m/zrRbr1JjBgAJ), Daniel Jonsson's [work on LVAT](https://github.com/DanOpcode?tab=repositories&q=+linux-variability-analysis-tools&type=&language=&sort=), and the [discussions](https://groups.google.com/g/kconfig-sat/c/G6HA_3ecAQI/m/vn3j0xWCAAAJ) in the [kconfig-sat](https://kernelnewbies.org/KernelProjects/kconfig-sat) initiative.
- **September**: We release the [feature-model-repository-pipeline](https://github.com/ekuiter/feature-model-repository-pipeline), which extends [kmax-vm](https://github.com/ekuiter/kmax-vm) with an integration of the [KConfigReader](#extractors) extractor.

**2022**
- **March**: We release [tseitin-or-not-tseitin](https://github.com/ekuiter/tseitin-or-not-tseitin), which extends the [feature-model-repository-pipeline](https://github.com/ekuiter/feature-model-repository-pipeline) with several [CNF transformations](#transformations) and Docker support.
- **October**: At [ASE'22](https://conf.researchr.org/track/ase-2022/ase-2022-research-papers), we study the [influence of CNF transformations](https://elias-kuiter.de/publications/#KKS+:ASE22) on the efficiency and effectiveness of feature-model analyses.

**2023**
- **March**: We release [torte](https://github.com/ekuiter/torte), a consequent evolution of [tseitin-or-not-tseitin](https://github.com/ekuiter/tseitin-or-not-tseitin) that supports generalizing over different experiments and integrates many different tools for feature-model analysis.
- **June**: [Till Sehlen](https://elias-kuiter.de/publications/#Sehlen23) empirically analyzes criteria for switching between [distributive and Tseitin transformation](#transformations) in order to speed up subsequent solver calls.

**2025**
- **February**: The [developers](https://github.com/isselab/configfix?tab=readme-ov-file#credits) of [ConfigFix](#extractors) attempt to [merge it](https://lkml.org/lkml/2025/2/8/405) into the kernel.
  The KConfig maintainer refuses due to prioritizing Linus Torvalds's future plans to [integrate](https://lore.kernel.org/lkml/CAHk-=whdrvCkSWh=BRrwZwNo3=yLBXXM88NGx8VEpP1VTgmkyQ@mail.gmail.com/) [even more](https://lore.kernel.org/lkml/CAK7LNATe7Ah-ow9wYGrtL9i4z-VD=MCo=sJjbC_S0ofEoH6CFQ/mail.gmail.com/) toolchain-related options (e.g., the compiler) into KConfig.
- **March**: [Eric Ketzler](https://elias-kuiter.de/publications/#Ketzler25) proposes an algorithm that enriches the feature-model formula extracted by [KClause](#extractors) with the feature hierarchy extracted by KConfigLib.
  This is a crucial step towards releasing a proper [UVL](https://universal-variability-language.github.io/) feature model for Linux.
- **April**: Our paper on [counting the features and configurations of Linux](https://elias-kuiter.de/publications/#KST+:TOSEM25) was accepted at [TOSEM](https://dl.acm.org/journal/tosem).
- **May**: [Urs-Benedict Braun](https://elias-kuiter.de/publications/#Braun25) performs initial experiments that show [SAT solvers cannot keep up with the Linux kernel](https://elias-kuiter.de/publications/#KBT+:ICSE26).
- **May**: [Rami Alfish](https://elias-kuiter.de/publications/#Alfish25) integrates [ConfigFix](#extractors) into torte and evaluates it on various systems.
- **August**: After eight years, [Masahiro Yamada](https://github.com/masahir0y) [steps down](https://web.git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=8d6841d5cb20) as Linux's maintainer of KBuild and KConfig, "two complex pieces of infrastructure that many people interact with, but few truly understand" (Source: [LWN](https://lwn.net/Articles/1032722/)).
  Nathan Chancellor and Nicolas Schier [now](https://www.phoronix.com/news/Kconfig-No-Longer-Orphaned) [maintain](https://lore.kernel.org/lkml/20251023-update-kconfig-maintainers-v1-1-0ebd5b4ecced@kernel.org/) KBuild, only providing "odd fixes" for KConfig.
  KConfig is now effectively unmaintained, and an integration of a SAT solver in the foreseeable future seems unlikely.
- **August**: LWN editor Daroc Alden counts [how many ways there are to configure the Linux kernel](https://lwn.net/Articles/1034811/), [exceeding](https://lwn.net/Articles/1034812/) our [own estimation](https://elias-kuiter.de/publications/#KST+:TOSEM25).
- **September**: [Taylan Karakaya](https://elias-kuiter.de/publications/#Karakaya25) analyzes the [evolution of LKC](https://github.com/torvalds/linux/commits/master/scripts/kconfig?after=05f7e89ab9731565d8a62e3b5d1ec206485eeb0b+69) from its pre-Git era all the way up until May 2025.
  From June 2025 onwards, we provide informal updates on KConfig below.
- **September**: The [transitional](https://github.com/torvalds/linux/commit/f9afce4f32e9a120fc902fa6c9e0b90ad799a6ec) keyword is introduced to LKC.
  This promptly causes a bug [reported by](https://github.com/torvalds/linux/commit/0902b3cb23ce7f436bddbdf6ba7b1ed427b36bd9) Linus Torvalds.
  It also [breaks parsing](https://github.com/zephyrproject-rtos/Kconfiglib/issues/25) in KConfigLib, an issue which is [being discussed](https://github.com/zephyrproject-rtos/Kconfiglib/pull/30), as simply ignoring the keyword creates new issues.
  To address this, the [Yocto project](https://git.yoctoproject.org/yocto-kernel-tools/commit/?id=f589e1df23251d8319063da0a61c1016b2a0bf85) proposes a change to KConfigLib, which is being reviewed.
- **September**: At [SPLC'25](https://2025.splc.net/accepted-papers/), we discuss [open challenges](https://elias-kuiter.de/publications/#K:SPLC25) of analyzing problem-space variability in system software.
- **October**: After [years](https://github.com/ulfalizer/Kconfiglib/issues/121) of [inactivity](https://github.com/zephyrproject-rtos/zephyr/issues/53894), [KConfigLib](#implementations) is now officially [being maintained](https://github.com/zephyrproject-rtos/Kconfiglib/issues/17) at Zephyr by [Torsten Tejlmand Rasmussen](https://github.com/tejlmand).

**2026**
- **February**: KConfig remains effectively unmaintained and receives [almost no commits](https://github.com/torvalds/linux/commits/master/scripts/kconfig).
  We release this website to summarize our knowledge and insights on the tool ecosystem for feature-model analysis.
- **March**: [Ljubica Ðorđević](https://elias-kuiter.de/publications/#Dordevic26) introduces a transformation from [KConfigLib](https://github.com/zephyrproject-rtos/Kconfiglib) specifications into Linux's KConfig dialect, which enables feature-model analysis of [Zephyr](https://github.com/zephyrproject-rtos/zephyr) and related projects.
- **April**: At [ICSE'26](https://conf.researchr.org/track/icse-2026/icse-2026-research-track), we study whether [SAT solvers can keep up with the Linux kernel](https://elias-kuiter.de/publications/#KBT+:ICSE26).
  We also [present torte](https://conf.researchr.org/track/icse-2026/icse-2026-demonstrations) to a wider audience and discuss the [configurability of the Linux kernel](https://conf.researchr.org/track/icse-2026/icse-2026-journal-first-papers).
