Our Aspire template had a `MigrationService` project. Everyone's does. It's what the docs tell you to build.

Then I actually read what ours was doing.

Three jobs in one `ExecuteAsync`: create the database, apply migrations, seed fake data. On Azure it shipped as an App Service with `IsAlwaysOn = true`. A web app that ran for forty seconds and then idled forever on a B1 plan.

And the only thing between Bogus test data and a production database was an `IsDevelopment()` check.

Guess what the deploy docs told you to do?

```
azd env set ASPNETCORE_ENVIRONMENT Development
```

Aspire now ships `AddEFMigrations`, which makes migrations a proper resource instead of a project you wrote yourself. We adopted it, deleted the bespoke plumbing, and killed the always-on App Service.

The bit I like most isn't the migrations though. It's this:

```csharp
if (builder.ExecutionContext.IsRunMode)
{
    var seeder = builder.AddProject<Seeder>("seeder")
        .WithReference(db)
        .WaitForCompletion(migrations);
}
```

The seeder never enters the graph at publish time. Run `aspire publish` and grep the output. There's nothing to find.

That's the difference between a guard and a structure. `IsDevelopment()` is a string comparison one `azd env set` away from failing. `IsRunMode` means the thing you're worried about doesn't exist in the artifact.

One catch worth knowing before you switch: `aspire deploy` does not apply your migrations. Aspire's job ends at building the bundle. Pointing it at the right database and running it is yours.

Full write-up, including the `BuildServiceProvider()` bug we found in the seeder's DI, which I suspect is hiding in a lot of Aspire projects:

👉 [POST URL]

If you've got a `MigrationService` in your tools folder, go and check what else it's doing while it's in there.

#dotnet #aspire #efcore #azure
