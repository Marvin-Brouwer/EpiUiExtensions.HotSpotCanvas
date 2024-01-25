[//]: # (Header)

# [Maintenance guide](/docs/Maintaining.md#readme)

[//]: # (Body)

Please take a moment to review this document in order to make the maintenance process easy and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of
the developers managing and developing this open source project. In return,
they should reciprocate that respect in addressing your issue or assessing
patches and features.

## Current Maintainers

- [Marvin Brouwer](https://github.com/Marvin-Brouwer)

## Verifying pull-requests

It's important that you inspect pull-requests thoroughly. If you can, please pull down the branch and inspect yourself.
Have a look at the benchmarking results and make sure no large performance degradation is added.

Pull-requests need at least these requirements:

- An issue has to be created prior to PR
- The branch has to adhere to the [branching guidelines](/docs/help/Contributing.md#pull-requests)
  - Correct source branch
  - Correct target branch
  - Correct branch naming
  - Etc.
- All tests have to pass
- Performance cannot degrade by too much of a margin  
  This is pretty subjective but still important.
- Additional dependencies have to be cleared by the entire team of maintainers.
- Changelogs have to be updated.

## Release management

Release management has not been defined yet.
See: <https://github.com/NL-Valtech/EpiServer.HotspotHero/issues/29>
