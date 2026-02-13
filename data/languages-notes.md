##### Notes

- Note that we are only interested in languages that explicitly encode a problem space.
  Having a dedicated language suggests that developers take an interest in assisting end users in configuration, because it provides added value over ad-hoc variability (e.g., extended tool support for interactive configuration).
  We do not consider ad-hoc approaches or solution-space-only approaches.
  We only consider languages that enable compile-time variability, which is key in system software due to the improved runtime performance.
  See also the notes below our [repository](#systems) of system software, where we give examples for systems that we exclude (often due to their lack of an explicit configuration language).
  While other configuration mechanisms do exist, and post interesting challenges as well (e.g., how to [reverse engineer](https://ieeexplore.ieee.org/document/6032485) a feature model), we consider them out of scope for our analysis here.
- Casing of `KConfig` (vs. `Kconfig` and `kconfig`) is done inconsistently across sources. Here we go with `KConfig` for better readability.
