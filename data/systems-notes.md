##### Notes

- For every system, we report the system name as used by its maintainers.
  We also include the project website, the canonical upstream (Git) repository, and relevant mirrors (which may have better availability, but can be less up-to-date).
  The number of releases is usually the number of Git tags.
  We also justify for each system why we consider it to be system software.
  In addition, we document the configuration language used to define features and their dependencies as well as the concrete implementation of the configuration-related tooling.
  Finally, we report when we last updated this row of the table (i.e., when we extracted the statistics).
- Some of these systems are integrated into our experimentation platform [torte](https://github.com/ekuiter/torte), where they can be experimented upon.
- We incorporate systems from the following research publications:
  - [BSL+:TSE13](https://doi.org/10.1109/TSE.2013.34):
  This publication explicitly addresses system software.
  - [KTM+:ESECFSE17](https://doi.org/10.1145/3106237.3106252):
  We include all systems categorized as system software.
  - [SBK+:SPLC24](https://doi.org/10.1145/3646548.3672590):
  We include all systems categorized as system software.
  We exclude the three feature models `android`, `ubuntu`, `windows`, which were created manually and do not belong to a real software system.
- We deliberately omit some systems:
  - `Freetz`: Excluded as `Freetz-NG` already includes the full history of `Freetz`.
  - `uClinux`:
    In 2002, the main components of `uClinux` were merged into the mainline Linux kernel (version 2.5.46) as `CONFIG_MMU=n`.
    Thus, its [source code](https://github.com/robutest/uclinux) has significant overlap with the mainline Linux kernel.
    [Berger et al.](https://doi.org/10.1109/TSE.2013.34) report three stages of configuration in `uClinux` (`base`, the kernel configuration, and `dist`/`distribution`/`config`).
    We only include the `distribution` system due to the overlapping kernel configuration and because we were unable to locate source code for the `base` system.
  - We exclude several systems that we consider system software, but which do not explicitly model features and their dependencies using a dedicated language.
    Instead, these systems use a variety of approaches that encode features implicitly in the solution space (i.e., the actual source code).
    For example, this may involve compile-time options via `.h` header files, the code generator Autoconf/M4 (aka `./configure`), custom `Makefile` patterns, or obscure build systems (e.g.,  BitBake recipes).
    The feature model is only implicit in these systems, and significant effort would be necessary to make it more explicit (if at all possibility due to Turing-completeness).
    Moreover, this implicitness suggests that no dedicated tooling exists for assisted configuration (unlike, for example, for KConfig), and that it may not even be needed.
    We exclude these systems from this survey, but include them here, as future work may study them in more detail:
    `diet libc`, `glibc`, `musl`, `Yocto`/`OpenEmbedded`
  - We exclude concrete Linux distributions (e.g., Ubuntu), which build on actual system software (i.e., the Linux kernel), but which we do not consider system software themselves (as their primary purpose is to appropriately bundle system software with application software).
    We also exclude these distributions to avoid biasing our dataset towards Linux too much.
    We *do* include higher-order tools which *assist in* building customized Linux distributions (e.g., targeting specific embedded systems), which are no distributions themselves.