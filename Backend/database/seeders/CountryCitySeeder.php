<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Country;
use App\Models\City;

class CountryCitySeeder extends Seeder
{
    public function run()
    {
        $data = [
            'Albania' => ['Tirana', 'Durrës', 'Shkodër'],
            'Macedonia' => ['Skopje', 'Tetovo', 'Bitola'],
            'Kosovo' => [
                'Prishtina', 'Gjakova', 'Peja', 'Mitrovica', 'Prizren', 'Ferizaj',
                'Gjilan', 'Vushtrri', 'Suharekë', 'Rahovec', 'Istog', 'Podujevë',
                'Malishevë', 'Kamenicë', 'Skenderaj', 'Lipjan', 'Deçan', 'Dragash',
                'Fushë Kosovë', 'Kaçanik', 'Obiliq', 'Shtime', 'Shtërpcë', 'Klinë',
                'Novobërdë', 'Hani i Elezit', 'Partesh', 'Ranillug', 'Kllokot'
            ],
            'Montenegro' => ['Podgorica', 'Nikšić', 'Herceg Novi'],
        ];

        foreach ($data as $countryName => $cities) {
            $country = Country::create(['name' => $countryName]);

            foreach ($cities as $cityName) {
                City::create([
                    'name' => $cityName,
                    'country_id' => $country->id,
                ]);
            }
        }
    }
}
