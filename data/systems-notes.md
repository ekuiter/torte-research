##### Notes

- **Name**: The system name as used by its maintainers. We also include the project website, the canonical upstream (Git) repository, and relevant mirrors (which may have better availability, but can be less up-to-date).
- **#Releases**: Usually the number of Git tags.
- **Initial Release**: 
- **Latest Release**: 
- **SLOC of Latest Release**: 
- **System Software**: Why do we consider this system to be system software?
- **Publications**: Papers referring to this system in the context of configurability.
- **Configuration Language**: Which language is used to define features and their dependencies?
- **Implementation**: Which implementation of Kconfig is used? (LKC = Linux Kernel Configurator)
- **Origin**: Where does this implementation originate?
- **Remarks**: 

Omitted systems:
uClinux (merged into main kernel 2.5.46 as CONFIG_MMU=n)
openembedded (part of yocto)
dietlibc, glibc, musl, Yocto (do not use Kconfig)
Linux distributions (there are too many which would introduce bias, and they all build on the low-level Linux kernel, so we wouldn’t consider them true system software)
freetz (its history is fully included in freetz-ng)forked from ([Source](https://github.com/Freetz/freetz))\n (as freetz-ng fully includes freetz, we do not consider freetz explicitly)
SBK+:SPLC24: android, ubuntu, windows	Mendonca2009	systems_software	SXFM (manually created, no relation to a real, specific software system)

fully incorporated publications 
[BSL+:TSE13](https://doi.org/10.1109/TSE.2013.34) ([models](https://github.com/DanOpcode/linux-variability-analysis-tools.formulas)) (which explicitly addresses system software), [SBK+:SPLC24](https://doi.org/10.1145/3646548.3672590) ([models](https://github.com/SoftVarE-Group/feature-model-benchmark/tree/master/feature_models/original/systems_software)) (which subsumes many other publications)
[KTM+:ESECFSE17](https://doi.org/10.1145/3106237.3106252) ([models](https://github.com/AlexanderKnueppel/is-there-a-mismatch/tree/master/Data/LargeFeatureModels))
