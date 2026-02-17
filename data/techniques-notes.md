##### Notes

- Note that we aim to continue our analysis in the following sections only with techniques that explicitly encode a problem space; that is, dedicated configuration languages.
  Having a dedicated language suggests that developers take an interest in assisting end users in configuration, because it provides added value over ad-hoc variability (e.g., extended tool support for interactive configuration).
  We do not consider ad-hoc approaches or solution-space-only approaches.
  We only consider languages that enable compile-time variability, which [is key](https://ecos.sourceware.org/docs-latest/cdl-guide/overview.approaches.html) in system software due to the improved runtime performance.
  The only such language that is of practical relevance today or system software is KConfig, which we continue to discuss below in detail:
  With KConfig, we cover lots of relevant systems, while other techniques are often tailored to a given system, requiring system-specific analysis.
  KConfig also seems to cover all systems where tool-assisted configuration is critical, because no other advanced and "battle-tested" configuration tooling has been built that is still relevant today.
  While other configuration techniques do exist, and post interesting challenges as well (e.g., how to [reverse engineer](https://ieeexplore.ieee.org/document/6032485) a feature model), we consider them out of scope for our analysis here.
- Overall, our review suggests that configuration techniques used by contemporary system software can be roughly partitioned into two "camps":
  On the one hand, we have KConfig as the sole dominant configuration language for explicitly defining a feature model and enabling tool-assisted configuration.
  On the other hand, we have a variety of ad-hoc approaches
- Casing of `KConfig` (vs. `Kconfig` and `kconfig`) is done inconsistently across sources. Here we go with `KConfig` for better readability.
- We disregard solution-space variability and feature-to-code mapping here, which are relevant, but distinct problems.
  On interest, here are some pointers for further reading:
  [BSLC+:SPLC10](https://link.springer.com/chapter/10.1007/978-3-642-15579-6_48),
  [LAL+:ICSE10](https://dl.acm.org/doi/10.1145/1806799.1806819),
  [DTS+:SPLC12](https://dl.acm.org/doi/10.1145/2362536.2362544),
  [HXC:VaMoS12](https://dl.acm.org/doi/10.1145/2110147.2110164),
  [NH:JSEP14](https://onlinelibrary.wiley.com/doi/10.1002/smr.1595),
  [NBKC:TSE15](https://ieeexplore.ieee.org/document/7065312),
  [G:ESECFSE17](https://dl.acm.org/doi/10.1145/3106237.3106283),
  [MC:SPLC21](https://dl.acm.org/doi/10.1145/3461001.3471151)