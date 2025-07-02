<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Str;
use ReflectionClass;

class GeneratePermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-permissions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $policyPath = app_path('Policies');
        $policyFiles = glob($policyPath . '/*.php');

        foreach ($policyFiles as $file) {
            $className = 'App\\Policies\\' . basename($file, '.php');

            if (!class_exists($className)) {
                require_once $file;
            }

            $reflection = new ReflectionClass($className);
            $modelName = str_replace('Policy', '', class_basename($className));
            $modelNameSnake = Str::snake($modelName);

            foreach ($reflection->getMethods() as $method) {
                if ($method->class === $className && !$method->isConstructor() && !$method->isStatic()) {
                    $methodName = $method->getName();
                    $permissionName = Str::snake($methodName) . '_' . $modelNameSnake;
                    Permission::firstOrCreate(['name' => $permissionName]);
                    $this->line("✔ Created/exists: {$permissionName}");
                }
            }
        }

        $this->info('✅ All permissions generated.');
    }
}
