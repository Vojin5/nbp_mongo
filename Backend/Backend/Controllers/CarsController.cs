using Backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Text.Json;

namespace Backend.Controllers;
[ApiController]
[Route("[controller]")]
public class CarsController : ControllerBase
{
    IMongoDatabase db = new MongoClient().GetDatabase("Automobili");

    [HttpPost("addCar")]
    public async Task<IActionResult> dodajauto([FromBody] JsonDocument newCar)
    {

        var carsCollection = db.GetCollection<BsonDocument>("Cars");
        String strJson = newCar.RootElement.ToString();
        var doc = BsonDocument.Parse(strJson);
        await carsCollection.InsertOneAsync(doc);
        return Ok();
    }

    [HttpGet("getAllCars")]
    public async Task<IActionResult> uzmisveAutomobile()
    {
        var carsCollection = db.GetCollection<BsonDocument>("Cars");
        var filter = Builders<BsonDocument>.Filter.Empty;
        var cars = await (await carsCollection.FindAsync<BsonDocument>(filter)).ToListAsync();
        string result = "[";
        for(int i = 0; i < cars.Count-1;i++)
        {
            cars[i]["_id"] = cars[i]["_id"].AsObjectId.ToString();
            result += cars[i].ToString() + ",";
        }
        cars[cars.Count - 1]["_id"] = cars[cars.Count - 1]["_id"].AsObjectId.ToString();
        result += cars[cars.Count - 1].ToString();
        result += "]";
        return Ok(result);
    }
}
