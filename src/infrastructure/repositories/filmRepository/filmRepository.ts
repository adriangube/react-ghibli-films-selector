import {Film} from '../../../domain/film/film';
import {FilmAdapter} from '../../adapters/film/types';
import {HttpClientDef} from '../../http-client/types';
import {ApiResponse} from '../../types';
import {EntityApi} from '../../types/api/entityApi';
import {categoryUrlsWithoutDefault, fetchAllCategories, LOCATIONS_BASE_URL, PEOPLE_BASE_URL, SPECIES_BASE_URL, VEHICLES_BASE_URL} from '../categories';
import {FilmRepository} from './types';


export const filmRepository: FilmRepository = async (id, adapter: FilmAdapter, httpClient: HttpClientDef): Promise<Film> => {
	const url = `${process.env.REACT_APP_BASE_API_URL}/films/${id}`;
	const apiData = await httpClient.get({url});

	const people = categoryUrlsWithoutDefault(apiData?.data?.people, PEOPLE_BASE_URL);
	const species = categoryUrlsWithoutDefault(apiData?.data?.species, SPECIES_BASE_URL);
	const locations = categoryUrlsWithoutDefault(apiData?.data?.locations, LOCATIONS_BASE_URL);
	const vehicles = categoryUrlsWithoutDefault(apiData?.data?.vehicles, VEHICLES_BASE_URL);


	const categories: any = [people,species, locations, vehicles];


	const resolvedCategories: any = await fetchAllCategories(categories, httpClient);

	apiData.data.people = resolvedCategories[0]?.map((data: ApiResponse<EntityApi[]>) => {
		return {...data?.data};
	});
	apiData.data.species = resolvedCategories[1]?.map((data: ApiResponse<EntityApi[]>) => {
		return {...data?.data};
	});
	apiData.data.locations = resolvedCategories[2]?.map((data: ApiResponse<EntityApi[]>) => {
		return {...data?.data};
	});
	apiData.data.vehicles = resolvedCategories[3]?.map((data: ApiResponse<EntityApi[]>) => {
		return {...data?.data};
	});
	return adapter(apiData?.data);
};