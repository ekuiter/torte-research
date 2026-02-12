##### Notes

- **Year**: For each extractor, we include the year it was first mentioned in the research literature (to the best of our knowledge). We do this to establish a rough timeline of all extractors.
- **KConfig parser**: We consider an extractor to support *evolutionary analysis* when it has been applied successfully on at least one project (e.g., Linux) over an extended time frame (i.e., over most of the project's lifetime).
  Likewise, an extractor supports *cross-project analysis* when it has been applied successfully across different projects (e.g., Linux *and* BusyBox).
  We assign both of these properties only with sufficient evidence (i.e., either we personally confirmed the property or it was explicitly documented in the literature).
  For all other extractors, we do not know for sure the extent to which they support evolutionary or cross-project analysis.
  However, relying on one fixed parser version necessarily restricts these capabilities dramatically (due to evolving KConfig syntax and semantics), which is why we mark these extractors as having *limited* support.
- Yet another extraction approach is described in [WWK:ConfWS15](https://ceur-ws.org/Vol-1453/20_WalchWalterKuechlin_FormalAnalysisOfTheLinuxKernel_Confws-15_p131.pdf). However, we were not able to locate the implementation mentioned in the paper.
