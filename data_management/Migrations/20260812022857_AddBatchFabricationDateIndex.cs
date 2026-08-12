using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataManagement.Migrations
{
    /// <inheritdoc />
    public partial class AddBatchFabricationDateIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_batches_fabrication_date",
                schema: "expegraph",
                table: "batches",
                column: "fabrication_date");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_batches_fabrication_date",
                schema: "expegraph",
                table: "batches");
        }
    }
}
