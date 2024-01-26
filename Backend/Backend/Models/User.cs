using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models;

public class User
{
    public String Username { get; set; }
    public String? Email { get; set; }
    public String Password { get; set; }
    public ObjectId Id { get; set; }

    public User(String username, String email, String password)
    {
        Username = username;
        Email = email;
        Password = password;
    }
}
