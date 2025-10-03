<?php

declare(strict_types=1);

namespace App\Imports;

use App\Models\Domain;
use App\Models\Skill;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

final class SkillsImport implements SkipsOnFailure, ToModel, WithChunkReading, WithHeadingRow, WithValidation
{
    use SkipsFailures;

    public function model(array $row)
    {
        $domainId = null;
        if (isset($row['domain']) && filled($row['domain'])) {
            $domain = Domain::firstOrCreate(['name' => mb_trim((string) $row['domain'])]);
            $domainId = $domain->id;
        }

        $skillName = mb_trim((string) $row['name']);
        $skill = Skill::firstOrNew(['name' => $skillName]);
        if ($skill->exists) {
            if ($skill->domain_id !== $domainId) {
                $skill->domain_id = $domainId;
                $skill->save();
            }

            return null;
        }

        return new Skill(['name' => $skillName, 'domain_id' => $domainId]);
    }

    public function chunkSize(): int
    {
        return 500;
    }

    public function rules(): array
    {
        return ['name' => ['required', 'string', 'max:255'], 'domain' => ['nullable', 'string', 'max:255']];
    }
}
