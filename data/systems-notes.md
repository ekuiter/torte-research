##### Notes

- For every system, we report the system name as used by its maintainers.
  We also include the project website, the canonical upstream (Git) repository, and relevant mirrors (which may have better availability, but can be less up-to-date).
  The number of releases is usually the number of Git tags.
  We also justify for each system why we consider it to be system software.
  In addition, we document which [implementation](#implementation) of KConfig is used.
  Finally, we report when we last updated this row of the table (i.e., when we extracted the statistics).
- Some of these systems are integrated into our experimentation platform [torte](https://github.com/ekuiter/torte), where they can be experimented upon.
- Among others, we incorporate all system software from the following research publications:
  - [BSL+:TSE13](https://doi.org/10.1109/TSE.2013.34):
  This publication explicitly addresses system software.
  - [KTM+:ESECFSE17](https://doi.org/10.1145/3106237.3106252):
  We include all systems categorized as system software.
  - [SBK+:SPLC24](https://doi.org/10.1145/3646548.3672590):
  We include all systems categorized as system software.
  We exclude the three feature models `android`, `ubuntu`, `windows`, which were created manually and do not belong to a real software system.
  We exclude `FreeBSD` for reasons detailed below.
  - [BSLWC:ASE10](https://dl.acm.org/doi/10.1145/1858996.1859010), [SLBWC:ICSE11](https://ieeexplore.ieee.org/document/6032485), [FHME:ASE22](https://dl.acm.org/doi/10.1145/3551349.3556899): The systems from these publications are either already subsumed by the above ones, or excluded below.
  - [LAL+:ICSE10](https://dl.acm.org/doi/10.1145/1806799.1806819):
  Most of the systems analyzed here would not be considered system software.
  The remaining systems are all excluded due to using [ad-hoc techniques](#techniques), or are explicitly excluded below.
- We deliberately exclude some systems (in addition to all systems that use an [ad-hoc technique](#techniques)):
  - `Freetz`: Excluded as `Freetz-NG` already includes the full history of `Freetz`.
  - `uClinux`:
    In 2002, the main components of `uClinux` were merged into the mainline Linux kernel (version 2.5.46) as `CONFIG_MMU=n`.
    Thus, its [source code](https://github.com/robutest/uclinux) has significant overlap with the mainline Linux kernel.
    [Berger et al.](https://doi.org/10.1109/TSE.2013.34) report three stages of configuration in `uClinux` (`base`, the kernel configuration, and `dist`/`distribution`/`config`).
    We only include the `distribution` system due to the overlapping kernel configuration and because we were unable to locate source code for the `base` system.
  - We exclude concrete Linux distributions (e.g., Ubuntu), which build on actual system software (i.e., the Linux kernel), but which we do not consider system software themselves (as their primary purpose is to appropriately bundle system software with application software).
    We also exclude such distributions to avoid biasing our dataset towards Linux too much.
    We *do* include higher-order tools which *assist in* building customized Linux distributions (e.g., targeting specific embedded systems), which are no distributions themselves.
  - `eCos`: not ad-hoc, but excluded nonetheless as explained [above](#techniques).
  - `FreeBSD`: [She et al.](https://ieeexplore.ieee.org/document/6032485) state that "FreeBSD is also an open-source OS. Unlike Linux and eCos, FreeBSD does not have a feature model, but only a flat list of features. [...] FreeBSD [...] does not have a reference feature model. [...] Since FreeBSD lacks a reference model, we created one manually for a subset of features." We exclude [this model](https://github.com/DanOpcode/linux-variability-analysis-tools.formulas) because it was [manually created](https://code.google.com/archive/p/variability/wikis/FreeBSDOntology.wiki), as FreeBSD does not encode an explicit feature model itself (see above).