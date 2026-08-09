Our SSW.VerticalSliceArchitecture template had a `MigrationService` project. Everyone's does. It's what the docs tell you to build.

I always had a nagging feeling about what it was doing and how it was doing it.

Three jobs in one method: create the database, apply migrations, seed fake data. It shipped to Azure as a long-running service that did forty seconds of work and then idled forever.

And the only thing between Bogus test data and a production database was an `IsDevelopment()` check.

Aspire now ships `AddEFMigrations`, which makes migrations a proper resource instead of a project you wrote yourself. We adopted it, deleted the bespoke plumbing, and the idle service went with it.

The bit I like most isn't the migrations though. It's that you can register the seeder only in run mode, so it never enters the graph at publish time. Guaranteeing you'll never accidentally seed production with test data is a big win.

That's the difference between a guard and a structure. `IsDevelopment()` is a string comparison one env var away from failing. `IsRunMode` means the thing you're worried about doesn't exist in the artifact.

Full write-up, including the `BuildServiceProvider()` bug we found in the seeder's DI, which I suspect is hiding in a lot of Aspire projects:

👉 https://www.dandoescode.com/blog/ef-core-migrations-in-aspire-with-addefmigrations

If you've got a `MigrationService` in your tools folder, go and check what else it's doing while it's in there.

#dotnet #aspire #efcore #azure #ssw #vsa
