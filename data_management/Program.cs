using DataManagement.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var dataSourceBuilder = new NpgsqlDataSourceBuilder(
    builder.Configuration.GetConnectionString("DefaultConnection"));
dataSourceBuilder.EnableDynamicJson();
var dataSource = dataSourceBuilder.Build();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(dataSource));

builder.Services.AddControllers();  // registers all controllers in the assembly
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")  // React TS dev server
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.MapControllers();   // maps all discovered controllers to routes automatically
         // applies the default CORS policy to all endpoints
app.Run();
