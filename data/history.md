### History

Here, we briefly summarize this project and notable developments within its scope.

**October 2002**

<!-- add information about the history of CML1, the proposals of CML2 etc. -->

- [Linux v2.5.45](https://lwn.net/Articles/14197/) introduces [KConfig](https://github.com/torvalds/linux/tree/master/scripts/kconfig) (developed by Roman Zippel), the successor of CML1 for specifying Linux's features and their dependencies.

**June 2017**
- To "surely a SAT solver can help", Linus Torvalds [answers](https://yhbt.net/lore/ksummit-discuss/CA+55aFyvssxg63UoQ-rOaf1TMacJ6T5jyLkWECosQJ_N=9gaaQ@mail.gmail.com/#t): "No. The SAT solver will only hurt, because it will bring in all those irrelevant people who are interested in SAT solving, not in making things easy for users."

**May 2018**
- We release [kmax-vm](https://github.com/ekuiter/kmax-vm), an [early predecessor](https://github.com/ekuiter/torte?tab=readme-ov-file#history) of torte that automates feature-model extraction with [KClause](#extractors) in a virtual machine.

**September 2021**
- We release the [feature-model-repository-pipeline](https://github.com/ekuiter/feature-model-repository-pipeline), which extends [kmax-vm](https://github.com/ekuiter/kmax-vm) with an integration of the [KConfigReader](#extractors) extractor.

**March 2022**
- We release [tseitin-or-not-tseitin](https://github.com/ekuiter/tseitin-or-not-tseitin), which extends the [feature-model-repository-pipeline](https://github.com/ekuiter/feature-model-repository-pipeline) with several [CNF transformations](#transformations) and Docker support.

**March 2023**
- We release [torte](https://github.com/ekuiter/torte), a consequent evolution of [tseitin-or-not-tseitin](https://github.com/ekuiter/tseitin-or-not-tseitin) that supports generalizing over different experiments and integrates many different tools for feature-model analysis.

**2023**
- **June**: [Till Sehlen](https://elias-kuiter.de/publications/#Sehlen23) empirically analyzes criteria for switching between [distributive and Tseitin transformation](#transformations) in order to speed up subsequent solver calls.

**February 2025**
- The [developers](https://github.com/isselab/configfix?tab=readme-ov-file#credits) of ConfigFix, a [feature-model formula extractor](#extractors) for KConfig, attempt to [merge it](https://lkml.org/lkml/2025/2/8/405) into the kernel.
  The KConfig maintainer refuses due to prioritizing Linus Torvalds's future plans to [integrate](https://lore.kernel.org/lkml/CAHk-=whdrvCkSWh=BRrwZwNo3=yLBXXM88NGx8VEpP1VTgmkyQ@mail.gmail.com/) [even more](https://lore.kernel.org/lkml/CAK7LNATe7Ah-ow9wYGrtL9i4z-VD=MCo=sJjbC_S0ofEoH6CFQ@mail.gmail.com/) toolchain-related options (e.g., the compiler) into KConfig.

**March 2025**
- [Eric Ketzler](https://elias-kuiter.de/publications/#Ketzler25) proposes an algorithm that enriches the feature-model formula extracted by [KClause](#extractors) with the feature hierarchy extracted by KConfigLib.
  This is a crucial step towards releasing a proper [UVL](https://universal-variability-language.github.io/) feature model for Linux.

**August 2025**
- After eight years, [Masahiro Yamada](https://github.com/masahir0y) [steps down](https://web.git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=8d6841d5cb20) as Linux's maintainer of KBuild and KConfig, "two complex pieces of infrastructure that many people interact with, but few truly understand" (Source: [LWN](https://lwn.net/Articles/1032722/)).
  KConfig is now entirely unmaintained and an integration of a SAT solver in the near future seems unlikely.

**September 2025**
- [Taylan Karakaya](https://elias-kuiter.de/publications/#Karakaya25) analyzes the [evolution of KConfig](https://github.com/torvalds/linux/commits/master/scripts/kconfig?after=05f7e89ab9731565d8a62e3b5d1ec206485eeb0b+69) in the Linux kernel from its pre-Git era all the way up until May 2025.
  From June 2025 onwards, we provide informal updates on KConfig below.
- The [`transitional`](https://github.com/torvalds/linux/commit/f9afce4f32e9a120fc902fa6c9e0b90ad799a6ec) keyword is introduced to the Linux kernel.
  This promptly causes a bug [reported by](https://github.com/torvalds/linux/commit/0902b3cb23ce7f436bddbdf6ba7b1ed427b36bd9) Linus Torvalds.
  It also [breaks parsing](https://github.com/zephyrproject-rtos/Kconfiglib/issues/25) in KConfigLib, an issue which is [being discussed](https://github.com/zephyrproject-rtos/Kconfiglib/pull/30), as simply ignoring the `transitional` keyword creates new issues.
  To address this, the [Yocto project](https://git.yoctoproject.org/yocto-kernel-tools/commit/?id=f589e1df23251d8319063da0a61c1016b2a0bf85) proposes a change to KConfigLib, which is being reviewed.

**October 2025**

- After [years](https://github.com/ulfalizer/Kconfiglib/issues/121) of [inactivity](https://github.com/zephyrproject-rtos/zephyr/issues/53894), [KConfigLib](https://github.com/zephyrproject-rtos/Kconfiglib) is now officially [being maintained](https://github.com/zephyrproject-rtos/Kconfiglib/issues/17) at Zephyr by [Torsten Tejlmand Rasmussen](https://github.com/tejlmand).

**February 2026**
- KConfig remains unmaintained and receives [almost no commits](https://github.com/torvalds/linux/commits/master/scripts/kconfig).
- We release this website to summarize our knowledge and insights on the tool ecosystem for feature-model analysis.

**March 2026**

- [Ljubica Ðorđević](https://elias-kuiter.de/publications/#Dordevic26) introduces a transformation from [KConfigLib](https://github.com/zephyrproject-rtos/Kconfiglib) specifications into Linux's KConfig dialect, which enables feature-model analysis of [Zephyr](https://github.com/zephyrproject-rtos/zephyr) and related projects.