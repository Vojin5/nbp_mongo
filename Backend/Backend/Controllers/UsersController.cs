using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Driver;
using MongoDB.Driver.Core.Operations;


namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
    IMongoDatabase db = new MongoClient().GetDatabase("Automobili");

    [HttpPost("register")]
    public async Task<IActionResult> addUser([FromBody] User user)
    {
        var usersCollection = db.GetCollection<User>("Users");
        await usersCollection.InsertOneAsync(user);
        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> loginUser([FromBody] User user)
    {
        var usersCollection = db.GetCollection<User>("Users");
        var filter = Builders<User>.Filter.Eq("Username", user.Username);
        var resultUser  = await usersCollection.Find<User>(filter).FirstOrDefaultAsync();
        if(resultUser == null)
        {
            return BadRequest("Specified User does not exsist");
        }
        else
        {
            if(resultUser.Password.Equals(user.Password))
            {
                var str = Newtonsoft.Json.JsonConvert.SerializeObject(resultUser.Id.ToString());
                return Ok(str);
            }
            else
            {
                return BadRequest("Bad password");
            }
        }
    }

    [HttpGet("getUser/{id}")]
    public async Task<IActionResult> getUserbyId([FromRoute] String id)
    {
        var usersCollection = db.GetCollection<User>("Users");
        ObjectId objId = new ObjectId(id);
        var filter = Builders<User>.Filter.Eq("_id", objId);
        var result = await usersCollection.Find<User>(filter).FirstOrDefaultAsync();
        if(result == null)
        {
            return BadRequest("Specified user does not exist");
        }
        else
        {
            return Ok(new
            {
                username = result.Username,
                email = result.Email,
                password = result.Password,
                id = result.Id.ToString()
            });
        }
    }
}
