<?php
namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\City;

class LocationController extends Controller
{
    public function getCountries()
    {
        $countries = Country::orderBy('name', 'asc')->get();
        return response()->json($countries);
    }

    public function getCitiesByCountry($countryId)
    {
        $cities = City::where('country_id', $countryId)->orderBy('name', 'asc')->get();
        return response()->json($cities);
    }
}
