using Backend.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using System.Collections;
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

    [HttpGet("getCarsCount")]
    public async Task<IActionResult> carscount()
    {
        var carsCollection = db.GetCollection<BsonDocument>("Cars");
        var filter = Builders<BsonDocument>.Filter.Empty;
        var carsnum = await carsCollection.CountDocumentsAsync(filter);
        var result = " { \"number\" : " + carsnum + " }";
        return Ok(result);
    }

    [HttpGet("getCars/{page}")]
    public async Task<IActionResult> getCarsPage(int page)
    {
        var carsCollection = db.GetCollection<BsonDocument>("Cars");
        var filter = Builders<BsonDocument>.Filter.Empty;
        var carsBson = await carsCollection.Find(filter).Skip(page*4).Limit(4).ToListAsync();
        string result = "[";
        for (int i = 0; i < carsBson.Count - 1; i++)
        {
            carsBson[i]["_id"] = carsBson[i]["_id"].AsObjectId.ToString();
            result += carsBson[i].ToString() + ",";
        }
        carsBson[carsBson.Count - 1]["_id"] = carsBson[carsBson.Count - 1]["_id"].AsObjectId.ToString();
        result += carsBson[carsBson.Count - 1].ToString();
        result += "]";
        return Ok(result);
    }

    [HttpPut("updateCars")]
    public async Task<IActionResult> updateCar([FromBody] JsonElement changes)
    {
        var carsCollection = db.GetCollection<BsonDocument>("Cars");
        foreach (JsonProperty property in changes.EnumerateObject())
        {
            string Carkey = property.Name;
            foreach(JsonElement subprop in property.Value.EnumerateArray())
            {
                foreach(var change in subprop.EnumerateObject())
                {
                    string changeProperty = change.Name;
                    string changeValue = change.Value.ToString();

                    
                    var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(Carkey));
                    var update = Builders<BsonDocument>.Update.Set(changeProperty, changeValue);
                    await carsCollection.UpdateOneAsync(filter, update);
                }
            }
            
        }
        return Ok();
    }

    [HttpDelete("deleteCar/{id}")]
    public async Task<IActionResult> deleteCar(string id)
    {
        var carsCollection = db.GetCollection<BsonDocument>("Cars");
        var filter = Builders<BsonDocument>.Filter.Eq("_id",ObjectId.Parse(id));
        await carsCollection.DeleteOneAsync(filter);
        return Ok();
    }

    [HttpGet("getBrandSorted/{page}")]
    public async Task<IActionResult> getBrandSorted(int page)
    {
        var carsCollection = db.GetCollection<BsonDocument>("Cars");
        var filter = Builders<BsonDocument>.Filter.Empty;
        var sort = Builders<BsonDocument>.Sort.Ascending("brand");
        var carsBson = await carsCollection.Find(filter).Sort(sort).Skip(page*4).Limit(4).ToListAsync();
        string result = "[";
        for (int i = 0; i < carsBson.Count - 1; i++)
        {
            carsBson[i]["_id"] = carsBson[i]["_id"].AsObjectId.ToString();
            result += carsBson[i].ToString() + ",";
        }
        carsBson[carsBson.Count - 1]["_id"] = carsBson[carsBson.Count - 1]["_id"].AsObjectId.ToString();
        result += carsBson[carsBson.Count - 1].ToString();
        result += "]";
        return Ok(result);

    }

    [HttpGet("getPriceAsc/{page}")]
    public async Task<IActionResult> getPriceAsc(int page)
    {
        var carsCollection = db.GetCollection<BsonDocument>("Cars");
        var filter = Builders<BsonDocument>.Filter.Empty;
        var sort = Builders<BsonDocument>.Sort.Ascending("cena");
        var carsBson = await carsCollection.Find(filter).Sort(sort).Skip(page * 4).Limit(4).ToListAsync();
        string result = "[";
        for (int i = 0; i < carsBson.Count - 1; i++)
        {
            carsBson[i]["_id"] = carsBson[i]["_id"].AsObjectId.ToString();
            result += carsBson[i].ToString() + ",";
        }
        carsBson[carsBson.Count - 1]["_id"] = carsBson[carsBson.Count - 1]["_id"].AsObjectId.ToString();
        result += carsBson[carsBson.Count - 1].ToString();
        result += "]";
        return Ok(result);
    }

    [HttpGet("getYearAsc/{page}")]
    public async Task<IActionResult> getYearAsc(int page)
    {
        var carsCollection = db.GetCollection<BsonDocument>("Cars");
        var filter = Builders<BsonDocument>.Filter.Empty;
        var sort = Builders<BsonDocument>.Sort.Ascending("godiste");
        var carsBson = await carsCollection.Find(filter).Sort(sort).Skip(page * 4).Limit(4).ToListAsync();
        string result = "[";
        for (int i = 0; i < carsBson.Count - 1; i++)
        {
            carsBson[i]["_id"] = carsBson[i]["_id"].AsObjectId.ToString();
            result += carsBson[i].ToString() + ",";
        }
        carsBson[carsBson.Count - 1]["_id"] = carsBson[carsBson.Count - 1]["_id"].AsObjectId.ToString();
        result += carsBson[carsBson.Count - 1].ToString();
        result += "]";
        return Ok(result);
    }
}
